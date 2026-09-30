"use client";

import { useState } from "react";
import { buatAkunPetugas, hapusAkunPetugas, updateAkunPetugas } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Trash2, UserPlus, Pencil, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog } from "@/components/ui/alert-dialog";

type Staff = { id: string; nama: string; email: string };

export default function StaffManagementClient({ initialStaffList }: { initialStaffList: Staff[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);

  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [staffToEdit, setStaffToEdit] = useState<Staff | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const handleDelete = async () => {
    if (!staffToDelete) return;
    setIsDeleting(true);
    const res = await hapusAkunPetugas(staffToDelete.id);
    setIsDeleting(false);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(res.success);
      setStaffToDelete(null);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const nama = formData.get("nama") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await buatAkunPetugas({ nama, email, password });
    setIsPending(false);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(res.success);
      setIsModalOpen(false);
      setShowCreatePassword(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!staffToEdit) return;
    setIsEditing(true);
    const formData = new FormData(e.currentTarget);
    const nama = formData.get("nama") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await updateAkunPetugas({
      id: staffToEdit.id,
      nama,
      email,
      password: password || undefined,
    });
    setIsEditing(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(res.success);
      setStaffToEdit(null);
      setShowEditPassword(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Create Button */}
      <div className="flex justify-end">
        <Button 
          onClick={() => {
            setIsModalOpen(true);
            setShowCreatePassword(false);
          }} 
          className="gap-2 bg-sibersih-primary hover:bg-sibersih-primary/90 text-white rounded-full px-6"
        >
          <UserPlus size={18} /> Tambah Petugas
        </Button>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-2xl shadow-sm border border-sibersih-primary/10 overflow-hidden">
        {initialStaffList.length === 0 ? (
          <div className="p-8 text-center text-sibersih-primary/50 font-medium">
            Belum ada akun petugas yang terdaftar.
          </div>
        ) : (
          <div className="divide-y divide-sibersih-primary/5">
            {initialStaffList.map((staff) => (
              <div key={staff.id} className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex flex-col">
                  <h3 className="font-bold text-sibersih-primary text-lg">{staff.nama}</h3>
                  <p className="text-sm text-sibersih-primary/60">{staff.email}</p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-sibersih-primary hover:text-sibersih-primary hover:bg-sibersih-primary/5 border-sibersih-primary/20"
                    onClick={() => {
                      setStaffToEdit(staff);
                      setShowEditPassword(false);
                    }}
                    title="Ubah Data Petugas"
                  >
                    <Pencil size={17} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                    onClick={() => setStaffToDelete(staff)}
                    title="Hapus Akun Petugas"
                  >
                    <Trash2 size={17} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog
        open={!!staffToDelete}
        onOpenChange={(open) => !open && setStaffToDelete(null)}
        title="Hapus Akun Petugas?"
        description={`Tindakan ini tidak dapat dibatalkan. Akun petugas ${staffToDelete?.nama} akan dihapus secara permanen dari sistem.`}
        variant="destructive"
        confirmText="Ya, Hapus"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-50 w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-6 animate-in zoom-in-95">
            <h2 className="text-xl font-bold text-sibersih-primary mb-1">Tambah Akun Petugas</h2>
            <p className="text-xs text-sibersih-primary/60 mb-5">
              Daftarkan akun petugas baru untuk penanganan laporan kebersihan.
            </p>
            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-sibersih-primary/80">Nama Lengkap</label>
                <input required name="nama" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sibersih-primary focus:ring-1 focus:ring-sibersih-primary outline-none transition-all" placeholder="Masukkan nama petugas" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-sibersih-primary/80">Email</label>
                <input required name="email" type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sibersih-primary focus:ring-1 focus:ring-sibersih-primary outline-none transition-all" placeholder="petugas@sibersih.com" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-sibersih-primary/80">Kata Sandi</label>
                <div className="relative flex items-center">
                  <input 
                    required 
                    name="password" 
                    type={showCreatePassword ? "text" : "password"} 
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 focus:border-sibersih-primary focus:ring-1 focus:ring-sibersih-primary outline-none transition-all" 
                    placeholder="Minimal 6 karakter" 
                    minLength={6} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                    className="absolute right-3.5 text-sibersih-primary/40 hover:text-sibersih-primary transition-colors focus:outline-none"
                    tabIndex={-1}
                    aria-label={showCreatePassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showCreatePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-full px-6">Batal</Button>
                <Button type="submit" disabled={isPending} className="rounded-full bg-sibersih-primary hover:bg-sibersih-primary/90 text-white px-6">
                  {isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {staffToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => {
              setStaffToEdit(null);
              setShowEditPassword(false);
            }} 
          />
          <div className="relative z-50 w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-6 animate-in zoom-in-95">
            <h2 className="text-xl font-bold text-sibersih-primary mb-1">Ubah Data Petugas</h2>
            <p className="text-xs text-sibersih-primary/60 mb-5">
              Perbarui informasi nama, email, atau kata sandi petugas.
            </p>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-sibersih-primary/80">Nama Lengkap</label>
                <input 
                  required 
                  name="nama" 
                  type="text" 
                  defaultValue={staffToEdit.nama} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sibersih-primary focus:ring-1 focus:ring-sibersih-primary outline-none transition-all" 
                  placeholder="Masukkan nama petugas" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-sibersih-primary/80">Email</label>
                <input 
                  required 
                  name="email" 
                  type="email" 
                  defaultValue={staffToEdit.email} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sibersih-primary focus:ring-1 focus:ring-sibersih-primary outline-none transition-all" 
                  placeholder="petugas@sibersih.com" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-sibersih-primary/80">Kata Sandi Baru</label>
                  <span className="text-[11px] text-sibersih-primary/50">(Opsional)</span>
                </div>
                <div className="relative flex items-center">
                  <input 
                    name="password" 
                    type={showEditPassword ? "text" : "password"} 
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 focus:border-sibersih-primary focus:ring-1 focus:ring-sibersih-primary outline-none transition-all" 
                    placeholder="Kosongkan jika tidak diubah" 
                    minLength={6} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3.5 text-sibersih-primary/40 hover:text-sibersih-primary transition-colors focus:outline-none"
                    tabIndex={-1}
                    aria-label={showEditPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showEditPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-[11px] text-sibersih-primary/50">
                  Biarkan kosong jika tetap menggunakan kata sandi saat ini.
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setStaffToEdit(null);
                    setShowEditPassword(false);
                  }} 
                  className="rounded-full px-6"
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  disabled={isEditing} 
                  className="rounded-full bg-sibersih-primary hover:bg-sibersih-primary/90 text-white px-6"
                >
                  {isEditing ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
