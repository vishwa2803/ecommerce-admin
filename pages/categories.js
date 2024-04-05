import Layout from "@/components/Layout";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import { useEffect, useState } from "react";

function CategoriesPage({ swal }) {
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }
  async function saveCategory(e) {
    e.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({ 
        name: p.name, values: p.values.split(','), })),
    };

    if (isEditing) {
      await axios.put("/api/categories", { ...data, _id: currentCategory._id });
      setIsEditing(false);
      setCurrentCategory(null);
    } else {
      const response = await axios.post("/api/categories", data);
      setCurrentCategory(response.data);
      setIsEditing(null);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }
  function editCategory(category) {
    setCurrentCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(category.properties.map(({name, values}) => ({
      name,
      values: values.join(',')
    })));
    setIsEditing(true);
  }
  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Delete",
        confirmButtonColor: "#d66",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      })
      .catch((error) => {
        // when promise rejected...
      });
  }
  function addProperty() {
    setProperties((e) => {
      return [...e, { name: "", values: "" }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties((e) => {
      const properties = [...e];
      properties[index].name = newName;
      return properties;
    });
  }
  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((e) => {
      const properties = [...e];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((e) => {
      return [...e].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {isEditing
          ? `Edit category ${currentCategory.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder={"Category name"}
          />
          <select
            className=" bg-white"
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option value={category._id}>{category.name}</option>
              ))}
          </select>
        </div>
        <div>
          <div className="mb-2">
            <label className="block">Properties</label>
            <button
              type="button"
              onClick={addProperty}
              className="btn-default text-sm mb-2"
            >
              + Add property
            </button>
            {properties.length > 0 &&
              properties.map((property, index) => (
                <div className="flex gap-1 mb-2">
                  <input
                    className="mb-0"
                    value={property.name}
                    onChange={(e) =>
                      handlePropertyNameChange(index, property, e.target.value)
                    }
                    type="text"
                    placeholder="property name (example: color)"
                  />
                  <input
                    value={property.values}
                    onChange={(e) =>
                      handlePropertyValuesChange(
                        index,
                        property,
                        e.target.value
                      )
                    }
                    className="mb-0"
                    type="text"
                    placeholder="values, comma separated"
                  />
                  <button
                    type="button"
                    onClick={() => removeProperty(index)}
                    className="btn-default "
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
        </div>
        <div className="flex gap-1">
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
              className="btn-default"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>

      {!isEditing && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <div className="flex gap-1">
                      <button
                        onClick={() => editCategory(category)}
                        className="btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(category)}
                        className="btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
export default withSwal(({ swal }, ref) => <CategoriesPage swal={swal} />);
