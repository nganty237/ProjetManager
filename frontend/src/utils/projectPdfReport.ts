import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Project } from '@/types';
import { isOverdue, getDaysRemaining, statusConfig, priorityConfig } from './constants';
import { getTotalExpenses, getBudgetConsumptionRate } from './budgetUtils';
import { expenseCategoryConfig } from './budgetConstants';

/**
 * Formatage sécurisé pour jsPDF (évite les caractères Unicode non supportés comme les espaces insécables \u202F)
 */
function formatCurrencyPdf(amount: number): string {
  if (isNaN(amount) || amount === undefined || amount === null) return '0 FCFA';
  const formatted = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} FCFA`;
}

function formatDatePdf(date: Date | string | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Génère et télécharge un rapport exécutif professionnel en PDF pour un projet.
 */
export function generateProjectPdfReport(project: Project): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = 14;

  // Calculs préalables
  const totalTasks = project.tasks?.length || 0;
  const completedTasks = (project.tasks || []).filter((t) => t.status === 'done').length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const expenses = project.expenses || [];
  const spent = getTotalExpenses(expenses);
  const allocated = project.budget?.allocated || 0;
  const remaining = allocated - spent;
  const consumptionRate = allocated > 0 ? getBudgetConsumptionRate(allocated, expenses) : 0;
  const overdue = isOverdue(project.endDate, project.status);
  const daysRemaining = project.endDate ? getDaysRemaining(project.endDate) : null;

  const statusLabel = statusConfig[project.status]?.label || project.status;
  const priorityLabel = priorityConfig[project.priority]?.label || project.priority;

  // ==========================================
  // 1. EN-TÊTE INSTITUTIONNEL
  // ==========================================
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(margin, currentY, pageWidth - margin * 2, 20, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('RAPPORT EXÉCUTIF D\'ÉTAT DE PROJET', margin + 6, currentY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225); // Slate 300
  const exportDate = new Date();
  const exportDateStr = `Édité le ${formatDatePdf(exportDate)} · Système Projet Manager`;
  doc.text(exportDateStr, margin + 6, currentY + 14.5);

  currentY += 26;

  // ==========================================
  // 2. IDENTITÉ DU PROJET
  // ==========================================
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(project.title, margin, currentY);

  currentY += 5;
  if (project.description) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139); // Slate 500
    const descLines = doc.splitTextToSize(project.description, pageWidth - margin * 2);
    doc.text(descLines, margin, currentY);
    currentY += descLines.length * 4 + 2;
  } else {
    currentY += 2;
  }

  // ==========================================
  // 3. FICHE TECHNIQUE & CALENDRIER (2 Lignes aérées)
  // ==========================================
  const metaBoxH = 18;
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, metaBoxH, 1.5, 1.5, 'FD');

  const contentW = pageWidth - margin * 2;
  const colW = contentW / 4;

  // LIGNE 1 : Statut, Priorité, Date Début, Date Fin
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text('Statut', margin + 4, currentY + 4.5);
  doc.text('Priorité', margin + colW + 4, currentY + 4.5);
  doc.text('Date de début', margin + colW * 2 + 4, currentY + 4.5);
  doc.text('Date d\'échéance', margin + colW * 3 + 4, currentY + 4.5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text(statusLabel, margin + 4, currentY + 8.5);
  doc.text(priorityLabel, margin + colW + 4, currentY + 8.5);
  doc.text(formatDatePdf(project.startDate), margin + colW * 2 + 4, currentY + 8.5);
  doc.text(project.endDate ? formatDatePdf(project.endDate) : 'Non définie', margin + colW * 3 + 4, currentY + 8.5);

  // LIGNE 2 : Échéance/Retard, Équipe
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Suivi du calendrier', margin + 4, currentY + 13);
  doc.text('Équipe affectée', margin + colW * 2 + 4, currentY + 13);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  if (overdue && daysRemaining !== null) {
    doc.setTextColor(225, 29, 72); // Rose 600
    doc.text(`En retard de ${Math.abs(daysRemaining)} jour${Math.abs(daysRemaining) > 1 ? 's' : ''}`, margin + 4, currentY + 16.5);
  } else if (daysRemaining !== null && daysRemaining >= 0 && project.status !== 'completed') {
    doc.setTextColor(15, 23, 42);
    doc.text(`${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} restant${daysRemaining > 1 ? 's' : ''}`, margin + 4, currentY + 16.5);
  } else {
    doc.setTextColor(16, 185, 129); // Emerald 600
    doc.text('Dans les délais', margin + 4, currentY + 16.5);
  }

  doc.setTextColor(15, 23, 42);
  const teamText = (project.team || []).length > 0
    ? (project.team || []).map((m) => m.name).join(', ')
    : 'Aucun membre assigné';
  const teamTextTruncated = doc.splitTextToSize(teamText, colW * 2 - 8)[0];
  doc.text(teamTextTruncated, margin + colW * 2 + 4, currentY + 16.5);

  currentY += metaBoxH + 6;

  // ==========================================
  // 4. 4 BLOCS KPIS EXÉCUTIFS
  // ==========================================
  const kpiBoxW = (pageWidth - margin * 2 - 9) / 4;
  const kpiBoxH = 15;

  const kpis = [
    {
      title: 'AVANCEMENT',
      val: `${progressPct}%`,
      sub: `${completedTasks} sur ${totalTasks} tâche${totalTasks > 1 ? 's' : ''}`,
    },
    {
      title: 'BUDGET ALLOUÉ',
      val: allocated > 0 ? formatCurrencyPdf(allocated) : 'Non défini',
      sub: 'Enveloppe prévisionnelle',
    },
    {
      title: 'TOTAL DÉPENSÉ',
      val: formatCurrencyPdf(spent),
      sub: allocated > 0 ? `${consumptionRate.toFixed(0)}% consommé` : 'Dépenses enregistrées',
    },
    {
      title: 'SOLDE DISPONIBLE',
      val: allocated > 0 ? formatCurrencyPdf(remaining) : '—',
      sub: remaining < 0 ? 'Dépassement constaté' : 'Disponible',
    },
  ];

  kpis.forEach((kpi, i) => {
    const x = margin + i * (kpiBoxW + 3);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, currentY, kpiBoxW, kpiBoxH, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(kpi.title, x + 3, currentY + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text(kpi.val, x + 3, currentY + 8.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text(kpi.sub, x + 3, currentY + 12.5);
  });

  currentY += kpiBoxH + 7;

  // ==========================================
  // 5. BILAN FINANCIER & DÉPENSES
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`1. Bilan Financier (${expenses.length} dépense${expenses.length > 1 ? 's' : ''})`, margin, currentY);
  currentY += 2.5;

  const expenseRows = expenses.map((exp) => [
    formatDatePdf(exp.date),
    exp.label,
    expenseCategoryConfig[exp.category]?.label || exp.category,
    exp.createdBy || 'Utilisateur',
    formatCurrencyPdf(exp.amount),
  ]);

  if (expenseRows.length === 0) {
    expenseRows.push(['—', 'Aucune dépense enregistrée sur ce projet', '—', '—', '0 FCFA']);
  }

  autoTable(doc, {
    startY: currentY,
    head: [['Date', 'Libellé', 'Catégorie', 'Auteur', 'Montant (FCFA)']],
    body: expenseRows,
    theme: 'plain',
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [51, 65, 85],
      fontStyle: 'bold',
      fontSize: 7.5,
      cellPadding: 2,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [51, 65, 85],
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 24 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 32 },
      3: { cellWidth: 28 },
      4: { cellWidth: 32, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: margin, right: margin },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // ==========================================
  // 6. SUIVI DES LIVRABLES & TÂCHES
  // ==========================================
  if (currentY > pageHeight - 45) {
    doc.addPage();
    currentY = 16;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`2. Suivi des Livrables & Tâches (${totalTasks} tâche${totalTasks > 1 ? 's' : ''} · ${completedTasks} livrée${completedTasks > 1 ? 's' : ''})`, margin, currentY);
  currentY += 2.5;

  const taskRows = (project.tasks || []).map((t) => [
    t.title,
    t.status === 'done' ? 'Terminé' : t.status === 'in-progress' ? 'En cours' : t.status === 'review' ? 'En révision' : 'À faire',
    priorityConfig[t.priority]?.label || t.priority,
    t.assignedTo?.name || 'Non assignée',
    t.dueDate ? formatDatePdf(t.dueDate) : '—',
  ]);

  if (taskRows.length === 0) {
    taskRows.push(['Aucune tâche définie sur ce projet', '—', '—', '—', '—']);
  }

  autoTable(doc, {
    startY: currentY,
    head: [['Tâche / Livrable', 'Statut', 'Priorité', 'Responsable', 'Échéance']],
    body: taskRows,
    theme: 'plain',
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [51, 65, 85],
      fontStyle: 'bold',
      fontSize: 7.5,
      cellPadding: 2,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [51, 65, 85],
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 25 },
      2: { cellWidth: 22 },
      3: { cellWidth: 32 },
      4: { cellWidth: 25 },
    },
    margin: { left: margin, right: margin },
  });

  // ==========================================
  // 7. PIED DE PAGE SUR TOUTES LES PAGES
  // ==========================================
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 9, pageWidth - margin, pageHeight - 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text('Projet Manager · Rapport Exécutif Confidentiel', margin, pageHeight - 5);
    doc.text(`Page ${i} sur ${totalPages}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
  }

  // ==========================================
  // 8. TÉLÉCHARGEMENT DU FICHIER
  // ==========================================
  const sanitizedTitle = project.title.replace(/[^a-zA-Z0-9À-ÿ_-]/g, '_').slice(0, 30);
  const fileName = `Rapport_${sanitizedTitle}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}
