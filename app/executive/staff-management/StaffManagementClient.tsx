"use client";

import { useState } from "react";
import { buatAkunPetugas, hapusAkunPetugas } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog } from "@/components/ui/alert-dialog";

type Staff = { id: string; nama: string; email: string };

export default function StaffManagementClient({ initialStaffList }: { initialStaffList: Staff[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const nama = formData.get('nama') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const res = await buatAkunPetugas({ nama, email, password });
    setIsPending(false);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(res.success);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Create Button */}
      <div className="flex justify-end">
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-sibersih-primary hover:bg-sibersih-primary/90 text-white rounded-full px-6">
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
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                  onClick={() => setStaffToDelete(staff)}
                >
                  <Trash2 size={18} />
                </Button>
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
            <h2 className="text-xl font-bold text-sibersih-primary mb-6">Tambah Akun Petugas</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                <input required name="password" type="password" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sibersih-primary focus:ring-1 focus:ring-sibersih-primary outline-none transition-all" placeholder="Minimal 6 karakter" minLength={6} />
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
    </div>
  );
}
