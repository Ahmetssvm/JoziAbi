require("dotenv").config();
const Port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const jwt=require("jsonwebtoken");




mongoose.connect(MONGO_URI) // MongoDB bağladık
.then(() => console.log("MongoDB connected"))
.catch((err)=> console.log(err));  

app.use(cors());
app.use(express.json());

// Şemalar

const productSchema = new mongoose.Schema({
    name:{ type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    stock: { type: Number, required: true , default: 0 }
});
const Product = mongoose.model("Product", productSchema);

// Güvenlik Bekçisi (Middleware)
const verifyToken = (req, res, next) => {
    // 1. Önce kalkan: İstekte authorization başlığı var mı? (Sunucu çökmesin diye)
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Erişim reddedildi. Anahtar (Token) bulunamadı." });
    }

    // 2. Başlık varsa, split ile boşluktan böl ve 2. parçayı (tokeni) al
    const token = req.headers.authorization.split(" ")[1];

    // 3. Token'ı bizim gizli kasadaki şifreyle doğrula
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = verified; // Doğrulanan yetkiyi isteğin içine not et
        next(); // Kapıyı aç, asıl işleme devam etmesine izin ver
    } catch (err) {
        // Token sahteyse veya süresi (1 saat) dolmuşsa buraya düşer
        return res.status(403).json({ message: "Geçersiz veya süresi dolmuş token." });
    }
};

//Admin Girişi
app.post("/admin/login",(req,res)=>{
    const{username,password} = req.body;

    try{
        if(username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD){

            const token=jwt.sign(
                {admin:process.env.ADMIN_USERNAME},
                process.env.JWT_SECRET,
                {expiresIn:"1h"}

            )


            res.status(200).json({message: "Admin girişi başarılı", token});
        }else{
            res.status(401).json({message: "Admin girişi başarısız"});
        }
    }catch(err){
        res.status(500).json({message: err.message});
    }

})



//Ürün Listeleme
app.get("/products",async(req,res)=>{
    try{
        const products = await Product.find();
       
        res.status(200).json({message: "ürünler başarıyla listelendi", products});
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

//Ürün Ekleme
app.post("/products",verifyToken,async(req,res)=>{
    const {name,price,description,imageUrl,stock} = req.body;

    try{
        const newProduct = new Product({name,price,description,imageUrl,stock});
        await newProduct.save();
        res.status(201).json({message: "ürün başarıyla eklendi", newProduct});
    }catch(err){
        res.status(500).json({message: err.message});
    }

})

//Ürün Güncelleme
app.put("/products/:id",verifyToken,async(req,res)=>{
    const {id} = req.params;
    
    try{
        const putProduct = await Product.findByIdAndUpdate(id,req.body,{new:true});
        if (!putProduct) {
            return res.status(404).json({message: "Ürün bulunamadı"});
        }
        res.status(200).json({message: "ürün başarıyla güncellendi", putProduct});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
})
//Ürün Silme
app.delete("/products/:id",verifyToken,async(req,res)=>{
    const {id} = req.params;
    try{
        const deleteProduct = await Product.findByIdAndDelete(id);
        if (!deleteProduct) {
            return res.status(404).json({message: "Ürün bulunamadı"});
        }
        res.status(200).json({message: "ürün başarıyla silindi", deleteProduct});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }

})


app.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`);
})