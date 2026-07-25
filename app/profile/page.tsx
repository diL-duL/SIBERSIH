'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Key, Bell, Camera, ShieldCheck, Edit, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center bg-zinc-50 px-6 pt-20 pb-40">
      <div className="max-w-3xl w-full flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-xl p-8 border border-zinc-200 shadow-sm flex flex-col md:flex-row items-center gap-8 transition-colors hover:border-zinc-300">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-50 shadow-sm relative">
              <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-900 text-4xl font-bold">
                S
              </div>
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="text-white w-8 h-8 mb-1" />
                <span className="text-white text-xs font-medium">Ubah</span>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-100 text-zinc-900 text-xs font-semibold tracking-wide mb-3">
              <ShieldCheck className="w-4 h-4" />
              Administrator
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">SIBERSIH Admin</h1>
            <p className="text-zinc-500 flex items-center justify-center md:justify-start gap-2 text-sm">
              <MapPin className="w-4 h-4" />
              Jakarta, Indonesia
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <button className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-medium transition-colors duration-300 flex items-center gap-2 text-sm shadow-sm">
              <Edit className="w-4 h-4" />
              Edit Profil
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-4 border border-zinc-200 shadow-sm sticky top-8 transition-colors hover:border-zinc-300">
              <nav className="flex flex-col gap-2">
                <button 
                  onClick={() => setActiveTab('personal')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium ${activeTab === 'personal' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
                >
                  <User className="w-4 h-4" />
                  Informasi Pribadi
                </button>
                <button 
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium ${activeTab === 'account' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
                >
                  <Key className="w-4 h-4" />
                  Pengaturan Akun
                </button>
                
                <div className="h-px bg-zinc-100 my-2"></div>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300 text-sm font-medium">
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl p-8 border border-zinc-200 shadow-sm min-h-[400px] transition-colors hover:border-zinc-300">
              
              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <div className="animate-in fade-in duration-500">
                  <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-zinc-700" />
                    Informasi Pribadi
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-colors duration-300">
                      <p className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wider">Nama Lengkap</p>
                      <p className="text-zinc-900 font-semibold text-sm">Admin SIBERSIH</p>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-colors duration-300">
                      <p className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wider">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-zinc-400" />
                        <p className="text-zinc-900 font-semibold text-sm">admin@sibersih.com</p>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-colors duration-300">
                      <p className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wider">No. Telepon</p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-zinc-400" />
                        <p className="text-zinc-900 font-semibold text-sm">+62 812 3456 7890</p>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-colors duration-300">
                      <p className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wider">Alamat</p>
                      <p className="text-zinc-900 font-semibold text-sm">Jl. Kebersihan No. 1, Jakarta</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Settings Tab */}
              {activeTab === 'account' && (
                <div className="animate-in fade-in duration-500">
                  <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6 flex items-center gap-2">
                    <Key className="w-5 h-5 text-zinc-700" />
                    Pengaturan Akun
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 hover:border-zinc-200 transition-colors duration-300 bg-zinc-50">
                      <div>
                        <h3 className="text-zinc-900 font-semibold text-sm">Ubah Kata Sandi</h3>
                        <p className="text-xs text-zinc-500 mt-1">Perbarui kata sandi secara berkala</p>
                      </div>
                      <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-100 rounded-lg font-medium transition-colors duration-300 text-xs shadow-sm">
                        Ubah
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 hover:border-zinc-200 transition-colors duration-300 bg-zinc-50">
                      <div>
                        <h3 className="text-zinc-900 font-semibold text-sm flex items-center gap-2">
                          <Bell className="w-4 h-4 text-zinc-500" />
                          Notifikasi Email
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1">Terima pembaruan tentang aktivitas akun</p>
                      </div>
                      <button 
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none ${notificationsEnabled ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ${notificationsEnabled ? 'translate-x-4' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    <div className="mt-8 p-4 rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-50 transition-colors duration-300">
                      <h3 className="text-red-700 font-semibold text-sm mb-1">Zona Bahaya</h3>
                      <p className="text-xs text-red-600 mb-4">Sekali Anda menghapus akun Anda, tidak ada jalan kembali.</p>
                      <button className="px-4 py-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 rounded-lg font-medium transition-colors duration-300 text-xs shadow-sm">
                        Hapus Akun
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
