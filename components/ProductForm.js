import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category:existingCategory,
  properties:assignedProperties,
}) {
  const [category, setCategory] = useState(existingCategory || "");
  const [productProperties,setProductProperties] = useState(assignedProperties || {});
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [newImages, setNewImages] = useState([]);
  const [goToProducts, setGoToProducts] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    })
  }, []);

  async function saveProduct(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("properties", JSON.stringify(productProperties));

    for (const image of newImages) {
      formData.append("images", image);
    }
   
    try {
      if (_id) {
        await axios.put(`/api/products?id=${_id}`, formData); // Include product ID in the URL
      } else {
        await axios.post('/api/products', formData);
      }
      setGoToProducts(true);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  }
  function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setImages((prevImages) => [...prevImages, ...files.map((file) => URL.createObjectURL(file))]);
  }
  if (goToProducts) {
    router.push("/products");
  }
function setProductProp(propName, value){
  setProductProperties(p => {
    const newProductProps = {...p};
    newProductProps[propName] = value;
    return newProductProps;
  })
}
  const propertiesToFill = [];
  if(categories.length > 0 && category){
    let catInfo = categories.find(({_id}) => _id === category)
    propertiesToFill.push(...catInfo.properties);
    while(catInfo?.parent?._id) {
      const parentCat = categories.find(({_id}) => _id === 
      catInfo?.parent?._id);
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }
  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Category</label>
      <select value={category} onChange={e => setCategory(e.target.value)}>
      <option value="">Uncategorized</option>
      {categories.length > 0 && categories.map(c => (
    <option key={c._id} value={c._id}>{c.name}</option>
  )

      )}
      </select>
      {propertiesToFill.length > 0 && propertiesToFill.map(p => (
  <div key={p.name} className="flex gap-1">
    <label>{p.name}</label> {/* Display property name */}
    <select 
      value={productProperties[p.name]} 
      onChange={(e) => setProductProp(p.name, e.target.value)}
    >
      {p.values.map(v => (
        <option key={v} value={v}>{v}</option>
      ))}
    </select>
  </div>
))}
      <label>Photos</label>
      <div className="flex gap-1 mb-2">
        <label className="w-24 h-24 cursor-pointer text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          Upload
          <input name="images" type="file" multiple className="hidden" onChange={handleImageUpload} />
        </label>
          <div className="flex gap-2 rounded-lg">
            {images.map((image, index) => (
              <div key={index} className="h-24 w-24 relative">
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
      </div>
      <label>description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <label>Price (in INR)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit" className="btn btn-primary">
        Save
      </button>
    </form>
  );
}
