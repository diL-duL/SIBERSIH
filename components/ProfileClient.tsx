'use client';

import React, { useState, useActionState, useEffect } from 'react';
import { User as UserIcon, Mail, Key, Moon, Sun, ShieldCheck, Edit, LogOut } from 'lucide-react';
import { logoutAction, changePasswordAction, updateProfileAction, deleteAccountAction } from '@/app/actions/user';
import { SubmitButton } from './SubmitButton';
import { useTheme } from 'next-themes';

type ProfileProps = {
  user: {
    id: string;
    nama: string;
    email: string;
    role: string;
  };
};

export default function ProfileClient({ user }: ProfileProps) {
  const [activeTab, setActiveTab] = useState('personal');
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  // States for actions
  const [changePwdState, changePwdAction] = useActionState(changePasswordAction, undefined);
  const [updateProfileState, updateProfileActionBound] = useActionState(updateProfileAction, undefined);
  const [deleteAccountState, deleteAccountActionBound] = useActionState(deleteAccountAction, undefined);

  // Handle success closures
  useEffect(() => {
    if (changePwdState?.success) {
      setTimeout(() => setIsChangePasswordModalOpen(false), 2000);
    }
  }, [changePwdState]);

  useEffect(() => {
    if (updateProfileState?.success) {
      setTimeout(() => setActiveTab('personal'), 2000);
    }
  }, [updateProfileState]);

  const getRoleDisplay = () => {
    switch(user.role) {
      case 'PELAPOR': return 'Civitas Akademik / Pelapor';
      case 'PETUGAS': return 'Petugas Kebersihan';
      case 'PIMPINAN': return 'Pimpinan / Executive';
      default: return 'Pengguna';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-sibersih-bg px-6 pt-20 pb-40">
      <div className="max-w-3xl w-full flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-xl p-8 border border-sibersih-primary/10 shadow-sm flex flex-col md:flex-row items-center gap-8 transition-colors hover:border-sibersih-accent">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-sibersih-bg shadow-sm relative">
              <div className="w-full h-full bg-sibersih-primary/5 flex items-center justify-center text-sibersih-primary text-4xl font-bold uppercase">
                {user.nama.charAt(0)}
              </div>
            </div>
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sibersih-primary/5 text-sibersih-primary text-xs font-semibold tracking-wide mb-3 uppercase">
              <ShieldCheck className="w-4 h-4" />
              {user.role}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-sibersih-primary mb-2">{user.nama}</h1>
            <p className="text-sibersih-primary/60 flex items-center justify-center md:justify-start gap-2 text-sm">
              <Mail className="w-4 h-4" />
              {user.email}
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
                  <UserIcon className="w-4 h-4" />
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
                    <UserIcon className="w-5 h-5 text-sibersih-primary/80" />
                    Informasi Pribadi
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 rounded-xl bg-sibersih-bg border border-sibersih-primary/5 hover:border-sibersih-primary/20 transition-colors duration-300">
                      <p className="text-xs text-sibersih-primary/60 font-medium mb-1 uppercase tracking-wider">Nama Lengkap</p>
                      <p className="text-sibersih-primary font-semibold text-sm">{user.nama}</p>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-sibersih-bg border border-sibersih-primary/5 hover:border-sibersih-primary/20 transition-colors duration-300">
                      <p className="text-xs text-sibersih-primary/60 font-medium mb-1 uppercase tracking-wider">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-sibersih-primary/40" />
                        <p className="text-sibersih-primary font-semibold text-sm">{user.email}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-sibersih-bg border border-sibersih-primary/5 hover:border-sibersih-primary/20 transition-colors duration-300">
                      <p className="text-xs text-sibersih-primary/60 font-medium mb-1 uppercase tracking-wider">Peran (Role)</p>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-sibersih-primary/40" />
                        <p className="text-sibersih-primary font-semibold text-sm">{getRoleDisplay()}</p>
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
                      <button 
                        onClick={() => setIsChangePasswordModalOpen(true)}
                        className="px-4 py-2 bg-white border border-sibersih-primary/10 text-sibersih-primary hover:bg-sibersih-primary/5 rounded-lg font-medium transition-colors duration-300 text-xs shadow-sm"
                      >
                        Ubah
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-sibersih-primary/5 hover:border-sibersih-primary/20 transition-colors duration-300 bg-sibersih-bg">
                      <div>
                        <h3 className="text-sibersih-primary font-semibold text-sm flex items-center gap-2">
                          {isDark ? (
                            <Moon className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Sun className="w-4 h-4 text-sibersih-primary/60" />
                          )}
                          Mode Gelap
                        </h3>
                        <p className="text-xs text-sibersih-primary/60 mt-1">
                          {isDark ? "Tema gelap aktif (nyaman untuk mata)" : "Aktifkan tampilan tema gelap untuk aplikasi"}
                        </p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setTheme(isDark ? 'light' : 'dark')}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none ${isDark ? 'bg-sibersih-primary' : 'bg-sibersih-primary/20'}`}
                        aria-label="Toggle mode gelap"
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ${isDark ? 'translate-x-4' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    <div className="mt-8 p-4 rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-50 transition-colors duration-300">
                      <h3 className="text-red-700 font-semibold text-sm mb-1">Zona Bahaya</h3>
                      <p className="text-xs text-red-600 mb-4">Sekali Anda menghapus akun Anda, tidak ada jalan kembali.</p>
                      <button 
                        onClick={() => setIsDeleteModalOpen(true)}
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
                  
                  <form action={updateProfileActionBound} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-sibersih-primary/80 mb-1">Nama Lengkap</label>
                      <input 
                        type="text" 
                        name="nama"
                        defaultValue={user.nama} 
                        className="w-full px-4 py-2 rounded-lg border border-sibersih-primary/10 focus:outline-none focus:ring-2 focus:ring-sibersih-accent focus:border-transparent transition-all text-sm placeholder:text-sibersih-primary/60 text-sibersih-primary" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-sibersih-primary/80 mb-1">Email</label>
                      <input type="email" defaultValue={user.email} disabled className="w-full px-4 py-2 rounded-lg border border-sibersih-primary/10 bg-sibersih-primary/5 text-sibersih-primary/60 cursor-not-allowed focus:outline-none transition-all text-sm" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-sibersih-primary/80 mb-1">Peran</label>
                      <div className="relative">
                        <select disabled className="w-full px-4 py-2 rounded-lg border border-sibersih-primary/10 bg-sibersih-primary/5 text-sibersih-primary/60 cursor-not-allowed focus:outline-none transition-all appearance-none text-sm">
                          <option>{getRoleDisplay()}</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                          <svg className="w-4 h-4 text-sibersih-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>
                    
                    {updateProfileState?.error && (
                      <p className="text-xs text-red-600 animate-in fade-in">{updateProfileState.error}</p>
                    )}
                    {updateProfileState?.success && (
                      <p className="text-xs text-green-600 animate-in fade-in">{updateProfileState.success}</p>
                    )}

                    <div className="flex gap-3 mt-8 pt-4">
                      <button type="button" onClick={() => setActiveTab('personal')} className="flex-1 px-4 py-2.5 rounded-lg border border-sibersih-primary/10 text-sibersih-primary/80 font-medium hover:bg-sibersih-primary/5 transition-colors text-sm">
                        Batal
                      </button>
                      <SubmitButton className="flex-1 rounded-lg text-sm shadow-sm">Simpan Perubahan</SubmitButton>
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
              <form action={logoutAction} className="flex-1">
                <SubmitButton className="w-full bg-red-600 text-white hover:bg-red-700 text-sm shadow-sm border-0 rounded-lg py-2.5 h-auto">Ya, Keluar</SubmitButton>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-sibersih-primary mb-2">Ubah Kata Sandi</h3>
            <p className="text-sm text-sibersih-primary/70 mb-4">
              Masukkan kata sandi lama Anda dan kata sandi baru yang diinginkan.
            </p>
            
            <form action={changePwdAction}>
              <div className="space-y-3 mb-6">
                <div>
                  <input 
                    name="oldPassword"
                    type="password" 
                    placeholder="Kata Sandi Lama" 
                    className="w-full px-4 py-2 rounded-lg border border-sibersih-primary/10 focus:outline-none focus:ring-2 focus:ring-sibersih-accent focus:border-transparent transition-all text-sm placeholder:text-sibersih-primary/40 text-sibersih-primary" 
                    required
                  />
                </div>
                <div>
                  <input 
                    name="newPassword"
                    type="password" 
                    placeholder="Kata Sandi Baru" 
                    className="w-full px-4 py-2 rounded-lg border border-sibersih-primary/10 focus:outline-none focus:ring-2 focus:ring-sibersih-accent focus:border-transparent transition-all text-sm placeholder:text-sibersih-primary/40 text-sibersih-primary" 
                    required
                  />
                </div>
                <div>
                  <input 
                    name="confirmPassword"
                    type="password" 
                    placeholder="Konfirmasi Kata Sandi Baru" 
                    className="w-full px-4 py-2 rounded-lg border border-sibersih-primary/10 focus:outline-none focus:ring-2 focus:ring-sibersih-accent focus:border-transparent transition-all text-sm placeholder:text-sibersih-primary/40 text-sibersih-primary" 
                    required
                  />
                </div>
                
                {changePwdState?.error && (
                  <p className="text-xs text-red-600 animate-in fade-in flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    {changePwdState.error}
                  </p>
                )}
                
                {changePwdState?.success && (
                  <p className="text-xs text-green-600 animate-in fade-in flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    {changePwdState.success}
                  </p>
                )}
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-sibersih-primary/10 text-sibersih-primary/80 font-medium hover:bg-sibersih-primary/5 transition-colors text-sm"
                >
                  Batal
                </button>
                <SubmitButton className="flex-1 rounded-lg text-sm shadow-sm py-2.5 h-auto">Simpan</SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-red-600 mb-2">Hapus Akun</h3>
            <p className="text-sm text-sibersih-primary/70 mb-4">
              Tindakan ini tidak dapat dibatalkan. Semua laporan Anda akan ikut terhapus. Silakan masukkan kata sandi Anda untuk mengonfirmasi.
            </p>
            <form action={deleteAccountActionBound}>
              <div className="mb-6">
                <input 
                  type="password"
                  name="password"
                  placeholder="Kata Sandi Anda" 
                  className={`w-full px-4 py-2 rounded-lg border ${deleteAccountState?.error ? 'border-red-500 focus:ring-red-500' : 'border-sibersih-primary/10 focus:ring-red-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm placeholder:text-sibersih-primary/40 text-sibersih-primary`} 
                  required
                />
                {deleteAccountState?.error && (
                  <p className="mt-2 text-xs text-red-600 animate-in fade-in flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    {deleteAccountState.error}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-sibersih-primary/10 text-sibersih-primary/80 font-medium hover:bg-sibersih-primary/5 transition-colors text-sm"
                >
                  Batal
                </button>
                <SubmitButton className="flex-1 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm shadow-sm py-2.5 h-auto border-0">Hapus Akun</SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
