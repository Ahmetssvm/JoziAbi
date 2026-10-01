import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Admin() {
    const [products, setProducts] = useState([]);  
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        imageUrl: '',
        stock: ''
    });
    const navigate = useNavigate();
       
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);   
    
    // Admin panelde ürünleri listelemek için backendden veri çekiyoruz
    useEffect(() => {
        axios.get('http://localhost:3000/products')
        .then((response) => {
            setProducts(response.data.products);
        })
        .catch((error) => {
            console.error("Ürünler listelenirken hata oluştu:", error);
        })
    }, []);
    
    const handleAddProduct = (e) => {
        e.preventDefault(); 

        const token = localStorage.getItem("token");

        axios.post('http://localhost:3000/products', newProduct, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            setProducts([...products, response.data.newProduct]);
            
            setNewProduct({
                name: '',
                price: '',
                description: '',
                imageUrl: '',
                stock: ''
            });
        })
        .catch((error) => {
            console.error("Ürün ekleme başarısız", error);
        });
    };

    const handleDeleteProduct = (productId, e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");    

        axios.delete(`http://localhost:3000/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            setProducts(products.filter(product => product._id !== productId));
        })
        .catch((error) => {
            console.error("Ürün silme başarısız", error);
        });
    };

    const handleUpStock = (productId, e, stock) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        axios.put(`http://localhost:3000/products/${productId}`, { stock: stock + 1 }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            setProducts(products.map(product => 
                product._id === productId ? { ...product, stock: product.stock + 1 } : product
            ));
        })
        .catch((error) => {
            console.error("Stok güncelleme başarısız", error);
        });
    };

    const handleDownStock = (productId, e, stock) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        
        axios.put(`http://localhost:3000/products/${productId}`, { stock: stock - 1 }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            setProducts(products.map(product =>
                product._id === productId ? { ...product, stock: product.stock - 1 } : product
            ));
        })
        .catch((error) => {
            console.error("Stok güncelleme başarısız", error);
        });
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-6 sm:p-10 selection:bg-blue-500 selection:text-white">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold mb-8 text-white tracking-tight">Yönetim Paneli</h1>

                {/* ÜRÜN EKLEME FORMU */}
                <div className="bg-slate-800/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-700/50 shadow-2xl mb-12">
                    <h2 className="text-xl font-bold mb-6 text-white">Yeni Ürün Ekle</h2>
                    <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            placeholder="Ürün Adı" 
                            value={newProduct.name} 
                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} 
                            className="bg-slate-900/50 border border-slate-700/60 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500" 
                            required 
                        />
                        <input 
                            type="number" 
                            placeholder="Fiyat" 
                            value={newProduct.price} 
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} 
                            className="bg-slate-900/50 border border-slate-700/60 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500" 
                            required 
                        />
                        <input 
                            type="text" 
                            placeholder="Açıklama" 
                            value={newProduct.description} 
                            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} 
                            className="bg-slate-900/50 border border-slate-700/60 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 sm:col-span-2" 
                            required 
                        />
                        <input 
                            type="text" 
                            placeholder="Resim URL" 
                            value={newProduct.imageUrl} 
                            onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})} 
                            className="bg-slate-900/50 border border-slate-700/60 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 sm:col-span-2" 
                            required 
                        />
                        <input 
                            type="number" 
                            placeholder="Stok" 
                            value={newProduct.stock} 
                            onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} 
                            className="bg-slate-900/50 border border-slate-700/60 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500" 
                            required 
                        />
                        
                        <button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all sm:col-span-2 mt-2"
                        >
                            Ürünü Ekle
                        </button>
                    </form>
                </div>

                {/* EKLENEN ÜRÜNLERİ LİSTELEME */}
                <div>
                    <h2 className="text-xl font-bold mb-6 text-white">Mevcut Ürünler</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products && products.map((product) => (
                            <div key={product._id} className="bg-slate-800/60 rounded-2xl border border-slate-700/60 overflow-hidden flex flex-col justify-between p-5 shadow-lg">
                                <div>
                                    <div className="w-full h-48 overflow-hidden rounded-xl bg-slate-900/50 mb-4">
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="font-bold text-base text-white mb-1 line-clamp-1">{product.name}</h3>
                                    <p className="text-blue-400 font-semibold mb-3">{product.price} TL</p>
                                </div>
                                
                                <div>
                                    <div className="flex items-center justify-between text-sm text-slate-300 bg-slate-900/40 p-2.5 rounded-xl border border-slate-700/40 mb-4">
                                        <span>Stok: <strong className="text-white">{product.stock}</strong></span>
                                        <div className="flex gap-1">
                                            <button 
                                                className="w-8 h-8 flex items-center justify-center bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-lg border border-emerald-500/30 transition-colors cursor-pointer font-bold" 
                                                onClick={(e) => handleUpStock(product._id, e, product.stock)}
                                            >
                                                +
                                            </button>
                                            <button 
                                                className="w-8 h-8 flex items-center justify-center bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 rounded-lg border border-rose-500/30 transition-colors cursor-pointer font-bold" 
                                                onClick={(e) => handleDownStock(product._id, e, product.stock)}
                                            >
                                                -
                                            </button>
                                        </div>
                                    </div>

                                    <button 
                                        className="w-full bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-medium py-2.5 px-4 rounded-xl transition-all cursor-pointer" 
                                        onClick={(e) => handleDeleteProduct(product._id, e)}
                                    >
                                        Ürünü Sil
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;