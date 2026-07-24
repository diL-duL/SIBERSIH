'use client';

import React, { useState } from 'react';

// --- Internal SVG Icons ---
const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const MailIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
);

const PhoneIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

const MapPinIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

const KeyIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
);

const BellIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
);

const CameraIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
);

const ShieldCheckIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
);

const EditIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
);

const LogOutIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
);

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-sibersih-bg font-sans selection:bg-sibersih-primary selection:text-white">
      {/* Background Gradient Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-sibersih-primary/10 blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-sibersih-surface/50 blur-[100px]" />
      </div>

      <main className="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-sibersih-surface mb-8 transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,86,145,0.08)]">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                <div className="w-full h-full bg-sibersih-primary/10 flex items-center justify-center text-sibersih-primary text-4xl font-bold">
                  S
                </div>
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <CameraIcon className="text-white w-8 h-8 mb-1" />
                  <span className="text-white text-xs font-medium">Ubah Foto</span>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sibersih-surface text-sibersih-primary text-xs font-semibold tracking-wide mb-3">
                <ShieldCheckIcon className="w-4 h-4" />
                Administrator
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">SIBERSIH Admin</h1>
              <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2">
                <MapPinIcon className="w-4 h-4" />
                Jakarta, Indonesia
              </p>
            </div>
            
            <div className="flex gap-3 mt-4 md:mt-0">
              <button className="px-6 py-2.5 bg-sibersih-primary hover:bg-sibersih-dark text-white rounded-xl font-medium transition-colors duration-300 flex items-center gap-2 shadow-sm shadow-sibersih-primary/20">
                <EditIcon className="w-4 h-4" />
                Edit Profil
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-sibersih-surface sticky top-8">
              <nav className="flex flex-col gap-2">
                <button 
                  onClick={() => setActiveTab('personal')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'personal' ? 'bg-sibersih-primary text-white shadow-md shadow-sibersih-primary/20' : 'text-gray-600 hover:bg-sibersih-surface hover:text-sibersih-primary'}`}
                >
                  <UserIcon className="w-5 h-5" />
                  Informasi Pribadi
                </button>
                <button 
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'account' ? 'bg-sibersih-primary text-white shadow-md shadow-sibersih-primary/20' : 'text-gray-600 hover:bg-sibersih-surface hover:text-sibersih-primary'}`}
                >
                  <KeyIcon className="w-5 h-5" />
                  Pengaturan Akun
                </button>
                
                <div className="h-px bg-gray-100 my-2"></div>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300 font-medium">
                  <LogOutIcon className="w-5 h-5" />
                  Keluar
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-sibersih-surface min-h-[400px]">
              
              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <UserIcon className="w-6 h-6 text-sibersih-primary" />
                    Informasi Pribadi
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group p-5 rounded-2xl bg-sibersih-surface/30 border border-transparent hover:border-sibersih-primary/20 hover:bg-sibersih-surface/50 transition-all duration-300">
                      <p className="text-sm text-gray-500 font-medium mb-1">Nama Lengkap</p>
                      <p className="text-gray-900 font-semibold text-lg group-hover:text-sibersih-primary transition-colors">Admin SIBERSIH</p>
                    </div>
                    
                    <div className="group p-5 rounded-2xl bg-sibersih-surface/30 border border-transparent hover:border-sibersih-primary/20 hover:bg-sibersih-surface/50 transition-all duration-300">
                      <p className="text-sm text-gray-500 font-medium mb-1">Email</p>
                      <div className="flex items-center gap-2">
                        <MailIcon className="w-4 h-4 text-gray-400 group-hover:text-sibersih-primary" />
                        <p className="text-gray-900 font-semibold text-lg">admin@sibersih.com</p>
                      </div>
                    </div>
                    
                    <div className="group p-5 rounded-2xl bg-sibersih-surface/30 border border-transparent hover:border-sibersih-primary/20 hover:bg-sibersih-surface/50 transition-all duration-300">
                      <p className="text-sm text-gray-500 font-medium mb-1">No. Telepon</p>
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 text-gray-400 group-hover:text-sibersih-primary" />
                        <p className="text-gray-900 font-semibold text-lg">+62 812 3456 7890</p>
                      </div>
                    </div>
                    
                    <div className="group p-5 rounded-2xl bg-sibersih-surface/30 border border-transparent hover:border-sibersih-primary/20 hover:bg-sibersih-surface/50 transition-all duration-300">
                      <p className="text-sm text-gray-500 font-medium mb-1">Alamat</p>
                      <p className="text-gray-900 font-semibold text-lg">Jl. Kebersihan No. 1, Jakarta Pusat, Indonesia</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Settings Tab */}
              {activeTab === 'account' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <KeyIcon className="w-6 h-6 text-sibersih-primary" />
                    Pengaturan Akun
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-sibersih-primary/20 hover:shadow-md hover:shadow-sibersih-primary/5 transition-all duration-300">
                      <div>
                        <h3 className="text-gray-900 font-semibold text-lg">Ubah Kata Sandi</h3>
                        <p className="text-sm text-gray-500 mt-1">Perbarui kata sandi Anda secara berkala demi keamanan</p>
                      </div>
                      <button className="px-5 py-2 bg-sibersih-surface text-sibersih-primary hover:bg-sibersih-primary hover:text-white rounded-xl font-medium transition-colors duration-300">
                        Ubah
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-sibersih-primary/20 hover:shadow-md hover:shadow-sibersih-primary/5 transition-all duration-300">
                      <div>
                        <h3 className="text-gray-900 font-semibold text-lg flex items-center gap-2">
                          <BellIcon className="w-5 h-5 text-gray-400" />
                          Notifikasi Email
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Terima pembaruan tentang aktivitas akun Anda</p>
                      </div>
                      <button 
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${notificationsEnabled ? 'bg-sibersih-primary' : 'bg-gray-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    <div className="mt-12 p-6 rounded-2xl border border-red-100 bg-red-50/50">
                      <h3 className="text-red-600 font-bold text-lg mb-2">Zona Bahaya</h3>
                      <p className="text-sm text-red-500/80 mb-4">Sekali Anda menghapus akun Anda, tidak ada jalan kembali. Harap berhati-hati.</p>
                      <button className="px-5 py-2 bg-white text-red-500 border border-red-200 hover:bg-red-500 hover:text-white rounded-xl font-medium transition-colors duration-300">
                        Hapus Akun
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
