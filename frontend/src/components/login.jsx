import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // 1. İstek at
            const cevap = await axios.post("http://localhost:3000/admin/login", {
                username: username,
                password: password
            });
            
            // --- BUNDAN SONRAKİLER SADECE ŞİFRE DOĞRUYSA ÇALIŞIR ---
            
            // 2. Bilet geldi, konsola yazdır ve kasaya kilitle
            console.log("Node.js'ten gelen cevap:", cevap.data);
            localStorage.setItem("token", cevap.data.token);

            // 3. Her şey başarılı, şimdi ışınlan!
            navigate("/admin");

        } catch (err) {
            // --- SADECE ŞİFRE YANLIŞSA BURASI ÇALIŞIR ---
            console.log("Hata oluştu:", err);
            alert("Kullanıcı adı veya şifre yanlış!"); 
            // Kod burada biter, adamı içeri almaz.
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 selection:bg-blue-500 selection:text-white">
            <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
                
                {/* Logo / İkon Alanı */}
                <div className="flex justify-center mb-8">
                    <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-8 text-white text-center">Yönetim Paneli</h1>
                
                <div className="space-y-5">
                    <div>
                        <input 
                            type="text" 
                            placeholder="Kullanıcı Adı" 
                            className="w-full bg-slate-900/50 border border-slate-700/60 rounded-xl px-5 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Şifre" 
                            className="w-full bg-slate-900/50 border border-slate-700/60 rounded-xl px-5 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    
                    <button 
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 mt-4" 
                        onClick={handleLogin}
                    >
                        Giriş Yap
                    </button>
                </div>
            </div>
        </div>  
    );
}

export default Login;