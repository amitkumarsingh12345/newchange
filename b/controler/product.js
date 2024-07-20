const product = require('../models/product');
const category = require('../models/category');
const multer = require('multer');
const { unlink } = require('fs').promises;


// ------------------DELETE FILE-----------------------

const deleteFile = async filePath => {
    await unlink(filePath);
}


// ---------------------------------PRODUCT POST API--------------------------------------------

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../../MYPROJECT/frontcode/public/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file?.originalname)
    }
})

const upload = multer({ storage: storage })

const addProduct = (upload.single('image'), async(req, res) => {
    await new product({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        image: req.file?.originalname,
        qty: req.body.qty,
        discription: req.body.discription,
    }).save().then((data) => res.status(200).send(data)).
        catch((error) => res.status(400).send(error));
});


// ------------------PRODUCT GET API-----------------------

const getProduct = async (req, res) => {
    await category.aggregate([
        {
            $lookup: {
                from: "products",
                localField: "name",
                foreignField: "category",
                as: "showdata"
            }
        },
        {
            $project: {
                _id: 0,
                showdata: 1
            }
        }
    ]).then((data) => res.status(200).send(data)).
        catch((error) => res.status(400).send(error));
};

// ------------------PRODUCT SEARCH API-----------------------

const productSearch = async (req, res) => {
    await product.find({ _id: req.params.id }).
        then((data) => res.status(200).send(data)).
        catch((error) => res.status(400).send(error));
};

// ------------------CART DELETE API-----------------------

const productDelete = async (req, res) => {
    await product.findOne({ _id: req.params.id }, { _id: 0, image: 1 }).
        then((data) => deleteFile(`../../MYPROJECT/frontcode/public/${data.image}`)).
        catch((error) => console.log(""));

    await product.deleteOne({ _id: req.params.id }).
        then((data) => res.status(200).send(data)).
        catch((error) => res.status(400).send(error));
};

// ------------------PRODUCT UPDATE API-----------------------

const productUpdate = (upload.single('image'), async(req, res) => {
    console.log(req.params);
    console.log(req.body);
    await product.findOne({ _id: req.params.id }, { _id: 0, image: 1 }).
        then((data) => typeof (req.file?.originalname) == 'string' && req.file?.originalname != data.image ? deleteFile(`../../CART_MANAGEMENT_SYSTEM/testfront/public/${data.image}`) : "").
        catch((error) => console.log(""));
    await product.updateOne(
        { _id: req.params.id },
        {
            $set: ({
                name: req.body.name,
                price: req.body.price,
                category: req.body.category,
                image: req.file?.originalname,
                qty: req.body.qty,
                discription: req.body.discription
            })
        }
    ).then((data) => res.status(200).send(data)).
        catch((error) => res.status(400).send(error));
});

module.exports = { addProduct, getProduct, productSearch, productDelete, productUpdate }