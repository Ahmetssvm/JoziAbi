import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
    const [products, setProducts] = useState([]);
    const [sliderIndex, setSliderIndex] = useState(0);

    useEffect(() => {
        if (products.length === 0) return;

        const interval = setInterval(() => {
            setSliderIndex(prevIndex => (prevIndex + 1) % products.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [products.length]);

    useEffect(() => {
        axios.get('http://localhost:3000/products')
        .then((response) => {
            setProducts(response.data.products);
        }).catch((error) => {
            console.error("Ürünler listelenirken bir hata oluştu:", error);
        });
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-blue-500 selection:text-white relative">
            {/* Özel Geçiş Animasyonu */}
            <style>{`
                @keyframes smoothFade {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-smooth-fade {
                    animation: smoothFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>

            {/* Navbar */}
            <nav className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 px-8 py-4 sticky top-0 z-50 flex justify-center items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/10 rounded-xl border border-blue-500/20">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Jozi3D</span>
                </div>
                
                {/* <Link to="/jozilogin" className="text-sm font-medium px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-600/50">
                    Yönetim Paneli
                </Link> */}
            </nav>

            {/* Ana İçerik */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-3">Mağazamıza Hoş Geldiniz</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">Yeni nesil üretim teknolojileri ve öne çıkan özel tasarımlarımızı keşfedin.</p>
                </div>
                
                {/* Öne Çıkan Ürün Slider Banner */}
                {products.length > 0 && products[sliderIndex] && (
                    <div 
                        key={sliderIndex} 
                        className="bg-slate-800/60 backdrop-blur-sm rounded-3xl border border-slate-700/60 overflow-hidden mb-16 shadow-2xl flex flex-col md:flex-row items-center animate-smooth-fade"
                    >
                        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 w-max px-3.5 py-1.5 rounded-full mb-6">Öne Çıkan Ürün</span>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">{products[sliderIndex].name}</h3>
                            <p className="text-slate-300 text-sm sm:text-base mb-8 line-clamp-3 leading-relaxed">{products[sliderIndex].description}</p>
                            <div className="flex items-center gap-6">
                                <span className="text-2xl font-black text-blue-400">{products[sliderIndex].price?.toFixed(2)} TL</span>
                                <span className="text-xs font-semibold text-slate-400 bg-slate-700/60 border border-slate-600/50 px-3.5 py-1.5 rounded-full">
                                    Stok: {products[sliderIndex].stock}
                                </span>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 h-72 sm:h-96 overflow-hidden bg-slate-900/50">
                            <img 
                                src={products[sliderIndex].imageUrl} 
                                alt={products[sliderIndex].name} 
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                )}
                
                {/* Ürün Listesi Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
                    {products.map((product) => (
                        <div key={product._id} className="group bg-slate-800/60 rounded-2xl border border-slate-700/60 overflow-hidden flex flex-col justify-between hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                            <div>
                                <div className="w-full h-52 overflow-hidden bg-slate-900/50 relative">
                                    <img 
                                        src={product.imageUrl} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                </div>
                                <div className="p-5">
                                    <h3 className="text-base font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">{product.name}</h3>
                                    <p className="text-slate-400 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                                </div>
                            </div>
                            
                            <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-700/40 mt-2 pt-4">
                                <span className="text-base font-bold text-blue-400">{product.price?.toFixed(2)} TL</span>
                                <span className="text-xs font-medium text-slate-400 bg-slate-700/50 border border-slate-600/40 px-2.5 py-1 rounded-full">
                                    Stok: {product.stock}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Sabit WhatsApp İletişim Butonu */}
            <a 
                href="https://wa.me/905000000000?text=Merhaba,%20Jozi3D%20ürünleriniz%20hakkında%20bilgi%20almak%20istiyorum." 
                target="_blank" 
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 duration-300 border border-emerald-400/30"
                title="WhatsApp ile İletişime Geç"
            >
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
            </a>
        </div>
    );
}

export default Home;