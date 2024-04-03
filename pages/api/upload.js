const multiparty = require('multiparty');

export default async function handle(req,res) {
    const form = multiparty.Form();
    const {fields, files} = await new Promise((resolve,reject) => {
        form.parse(req, (err, fields, files) => {
if(err) reject(err);
resolve({fields, files});
    });  
    });

}

export const config = {
    api: {bodyParser: false},
}