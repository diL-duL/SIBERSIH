'use client';

import React, { useState } from 'react';
import { User, Mail, Key, Bell, ShieldCheck, Edit, LogOut } from 'lucide-react';

export default function StaffProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteAccount = () => {
    if (deletePassword !== 'password') {
      setDeleteError('Kata sandi yang Anda masukkan salah.');
      return;
    }
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-sibersih-bg px-6 pt-20 pb-40">
      <div className="max-w-3xl w-full flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-xl p-8 border border-sibersih-primary/10 shadow-sm flex flex-col md:flex-row items-center gap-8 transition-colors hover:border-sibersih-accent">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-sibersih-bg shadow-sm relative">
              <div className="w-full h-full bg-sibersih-primary/5 flex items-center justify-center text-sibersih-primary text-4xl font-bold">
                J
              </div>
            </div>
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sibersih-primary/5 text-sibersih-primary text-xs font-semibold tracking-wide mb-3">
              <ShieldCheck className="w-4 h-4" />
              Petugas Kebersihan
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-sibersih-primary mb-2">Pak Joko</h1>
            <p className="text-sibersih-primary/60 flex items-center justify-center md:justify-start gap-2 text-sm">
              <Mail className="w-4 h-4" />
              joko@staff.sibersih.com
            </p>
          </div>
          

        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-4 border border-sibersih-primary/10 shadow-sm sticky top-8 transition-colors hover:border-sibersih-accent">
              <nav className="flex flex-col gap-2">
                <button 
                  onClick={() => setActiveTab('personal')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium ${activeTab === 'personal' ? 'bg-sibersih-primary/5 text-sibersih-primary' : 'text-sibersih-primary/60 hover:bg-sibersih-primary/5 hover:text-sibersih-primary'}`}
                >
                  <User className="w-4 h-4" />
                  Informasi Pribadi
                </button>
                <button 
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium ${activeTab === 'account' ? 'bg-sibersih-primary/5 text-sibersih-primary' : 'text-sibersih-primary/60 hover:bg-sibersih-primary/5 hover:text-sibersih-primary'}`}
                >
                  <Key className="w-4 h-4" />
                  Pengaturan Akun
                </button>
                <button 
                  onClick={() => setActiveTab('edit')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium ${activeTab === 'edit' ? 'bg-sibersih-primary/5 text-sibersih-primary' : 'text-sibersih-primary/60 hover:bg-sibersih-primary/5 hover:text-sibersih-primary'}`}
                >
                  <Edit className="w-4 h-4" />
                  Edit Profil
                </button>
                
                <div className="h-px bg-sibersih-primary/5 my-2"></div>
                
                <button 
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300 text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl p-8 border border-sibersih-primary/10 shadow-sm min-h-[400px] transition-colors hover:border-sibersih-accent">
              
              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <div className="animate-in fade-in duration-500">
                  <h2 className="text-xl font-bold tracking-tight text-sibersih-primary mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-sibersih-primary/80" />
                    Informasi Pribadi
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 rounded-xl bg-sibersih-bg border border-sibersih-primary/5 hover:border-sibersih-primary/20 transition-colors duration-300">
                      <p className="text-xs text-sibersih-primary/60 font-medium mb-1 uppercase tracking-wider">Nama Lengkap</p>
                      <p className="text-sibersih-primary font-semibold text-sm">Pak Joko</p>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-sibersih-bg border border-sibersih-primary/5 hover:border-sibersih-primary/20 transition-colors duration-300">
                      <p className="text-xs text-sibersih-primary/60 font-medium mb-1 uppercase tracking-wider">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-sibersih-primary/40" />
                        <p className="text-sibersih-primary font-semibold text-sm">joko@staff.sibersih.com</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-sibersih-bg border border-sibersih-primary/5 hover:border-sibersih-primary/20 transition-colors duration-300">
                      <p className="text-xs text-sibersih-primary/60 font-medium mb-1 uppercase tracking-wider">Peran (Role)</p>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-sibersih-primary/40" />
                        <p className="text-sibersih-primary font-semibold text-sm">Petugas Kebersihan</p>
                      </div>
                    </div>
                    

                  </div>
                </div>
              )}

              {/* Account Settings Tab */}
              {activeTab === 'account' && (
                <div className="animate-in fade-in duration-500">
                  <h2 className="text-xl font-bold tracking-tight text-sibersih-primary mb-6 flex items-center gap-2">
                    <Key className="w-5 h-5 text-sibersih-primary/80" />
                    Pengaturan Akun
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-sibersih-primary/5 hover:border-sibersih-primary/20 transition-colors duration-300 bg-sibersih-bg">
                      <div>
                        <h3 className="text-sibersih-primary font-semibold text-sm">Ubah Kata Sandi</h3>
                        <p className="text-xs text-sibersih-primary/60 mt-1">Perbarui kata sandi secara berkala</p>
                      </div>
                      <button className="px-4 py-2 bg-white border border-sibersih-primary/10 text-sibersih-primary hover:bg-sibersih-primary/5 rounded-lg font-medium transition-colors duration-300 text-xs shadow-sm">
                        Ubah
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-sibersih-primary/5 hover:border-sibersih-primary/20 transition-colors duration-300 bg-sibersih-bg">
                      <div>
                        <h3 className="text-sibersih-primary font-semibold text-sm flex items-center gap-2">
                          <Bell className="w-4 h-4 text-sibersih-primary/60" />
                          Notifikasi Email
                        </h3>
                        <p className="text-xs text-sibersih-primary/60 mt-1">Terima pembaruan tentang aktivitas akun</p>
                      </div>
                      <button 
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none ${notificationsEnabled ? 'bg-sibersih-primary' : 'bg-sibersih-primary/20'}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ${notificationsEnabled ? 'translate-x-4' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    <div className="mt-8 p-4 rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-50 transition-colors duration-300">
                      <h3 className="text-red-700 font-semibold text-sm mb-1">Zona Bahaya</h3>
                      <p className="text-xs text-red-600 mb-4">Sekali Anda menghapus akun Anda, tidak ada jalan kembali.</p>
                      <button 
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setDeletePassword('');
                          setDeleteError('');
                        }}
                        className="px-4 py-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 rounded-lg font-medium transition-colors duration-300 text-xs shadow-sm"
                      >
                        Hapus Akun
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Profile Tab */}
              {activeTab === 'edit' && (
                <div className="animate-in fade-in duration-500">
                  <h2 className="text-xl font-bold tracking-tight text-sibersih-primary mb-6 flex items-center gap-2">
                    <Edit className="w-5 h-5 text-sibersih-primary/80" />
                    Edit Profil
                  </h2>
                  
                  <form className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-sibersih-primary/80 mb-1">Nama Lengkap</label>
                      <input type="text" placeholder="Pak Joko" className="w-full px-4 py-2 rounded-lg border border-sibersih-primary/10 focus:outline-none focus:ring-2 focus:ring-sibersih-accent focus:border-transparent transition-all text-sm placeholder:text-sibersih-primary/60 text-sibersih-primary" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-sibersih-primary/80 mb-1">Email</label>
                      <input type="email" defaultValue="joko@staff.sibersih.com" disabled className="w-full px-4 py-2 rounded-lg border border-sibersih-primary/10 bg-sibersih-primary/5 text-sibersih-primary/60 cursor-not-allowed focus:outline-none transition-all text-sm" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-sibersih-primary/80 mb-1">Peran</label>
                      <div className="relative">
                        <select disabled className="w-full px-4 py-2 rounded-lg border border-sibersih-primary/10 bg-sibersih-primary/5 text-sibersih-primary/60 cursor-not-allowed focus:outline-none transition-all appearance-none text-sm">
                          <option value="staff">Petugas Kebersihan</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                          <svg className="w-4 h-4 text-sibersih-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-8 pt-4">
                      <button type="button" onClick={() => setActiveTab('personal')} className="flex-1 px-4 py-2.5 rounded-lg border border-sibersih-primary/10 text-sibersih-primary/80 font-medium hover:bg-sibersih-primary/5 transition-colors text-sm">
                        Batal
                      </button>
                      <button type="button" onClick={() => setActiveTab('personal')} className="flex-1 px-4 py-2.5 rounded-lg bg-sibersih-primary text-white font-medium hover:bg-sibersih-primary/90 transition-colors text-sm shadow-sm">
                        Simpan Perubahan
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-sibersih-primary mb-2">Konfirmasi Keluar</h3>
            <p className="text-sm text-sibersih-primary/70 mb-6">
              Apakah Anda yakin ingin keluar dari akun ini?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-sibersih-primary/10 text-sibersih-primary/80 font-medium hover:bg-sibersih-primary/5 transition-colors text-sm"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  window.location.href = '/';
                }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-sm shadow-sm"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-red-600 mb-2">Hapus Akun</h3>
            <p className="text-sm text-sibersih-primary/70 mb-4">
              Tindakan ini tidak dapat dibatalkan. Silakan masukkan kata sandi Anda untuk mengonfirmasi.
            </p>
            <div className="mb-6">
              <input 
                type="password" 
                placeholder="Kata Sandi Anda" 
                value={deletePassword}
                onChange={(e) => {
                  setDeletePassword(e.target.value);
                  setDeleteError('');
                }}
                className={`w-full px-4 py-2 rounded-lg border ${deleteError ? 'border-red-500 focus:ring-red-500' : 'border-sibersih-primary/10 focus:ring-red-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm placeholder:text-sibersih-primary/40 text-sibersih-primary`} 
              />
              {deleteError && (
                <p className="mt-2 text-xs text-red-600 animate-in fade-in flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  {deleteError}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletePassword('');
                  setDeleteError('');
                }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-sibersih-primary/10 text-sibersih-primary/80 font-medium hover:bg-sibersih-primary/5 transition-colors text-sm"
              >
                Batal
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-sm shadow-sm"
              >
                Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
