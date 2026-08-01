import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import UploadBuktiForm from "./UploadBuktiForm";

export default async function UploadBuktiPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user || session.user.role !== "PETUGAS") redirect("/login");

    const resolvedParams = await params;
    const report = await prisma.report.findUnique({
        where: { id: resolvedParams.id }
    });

    if (!report) {
        notFound();
    }

    return <UploadBuktiForm report={report} />;
}