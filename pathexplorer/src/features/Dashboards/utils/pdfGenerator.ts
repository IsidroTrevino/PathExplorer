import { format } from 'date-fns';
import html2canvas from 'html2canvas';

export async function generateDashboardPDF(
  data: any, 
  dashboardType: 'manager' | 'tfs',
  chartRefs?: Record<string, React.RefObject<HTMLDivElement | null>>
) {
  // Dynamically import jsPDF to avoid SSR issues
  const { jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Add header with logo and app name
  await addHeaderWithLogo(doc);
  
  // Add title and date
  const title = dashboardType === 'manager' ? 'Manager Dashboard Report' : 'TFS Dashboard Report';
  const date = format(new Date(), 'MMMM d, yyyy');
  
  doc.setFontSize(18);
  doc.setTextColor(117, 0, 192); // #7500C0
  doc.text(title, 14, 40);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${date}`, 14, 48);
  
  // Add content based on dashboard type
  if (dashboardType === 'manager') {
    await generateManagerReport(doc, data, autoTable, chartRefs);
  } else {
    await generateTFSReport(doc, data, autoTable, chartRefs);
  }
  
  // Save the PDF
  doc.save(`${dashboardType}_dashboard_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

async function addHeaderWithLogo(doc: any) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.src = '/accenture/Acc_GT_Dimensional_RGB.png';
    
    img.onload = function() {
      // Calculate dimensions to match logo height with text height
      const logoHeight = 8; // mm - approximately the height of the text
      const aspectRatio = img.width / img.height;
      const logoWidth = logoHeight * aspectRatio;
      
      // Position logo to the left of the text
      const logoX = 14;
      const logoY = 16; // Align with the text vertical center
      
      // Add logo
      doc.addImage(img, 'PNG', logoX, logoY - (logoHeight * 0.8), logoWidth, logoHeight);
      
      // Add app name - shifted to the right to accommodate logo
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.setFont('helvetica', 'bold');
      doc.text('PathExplorer', logoX + logoWidth + 5, 20);
      
      resolve();
    };
    
    img.onerror = function() {
      console.error('Error loading Accenture logo');
      // Still add the app name if logo fails
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.setFont('helvetica', 'bold');
      doc.text('PathExplorer', 14, 20);
      
      resolve();
    };
  });
}

async function captureChart(chartRef: React.RefObject<HTMLDivElement | null>) {
  if (!chartRef.current) return null;
  
  try {
    // Wait a moment to ensure chart is fully rendered
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Clone the node to avoid modifying the original
    const clonedNode = chartRef.current.cloneNode(true) as HTMLElement;
    
    // Create a temporary container for the cloned chart
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.top = '-9999px';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '800px';
    tempContainer.style.height = '400px';
    tempContainer.style.backgroundColor = '#ffffff';
    tempContainer.appendChild(clonedNode);
    document.body.appendChild(tempContainer);
    
    // Force all oklch colors to standard RGB in the clone
    const elements = tempContainer.querySelectorAll('*');
    elements.forEach(el => {
      const computedStyle = window.getComputedStyle(el as Element);
      const htmlEl = el as HTMLElement;
      
      // Apply computed RGB colors directly
      htmlEl.style.color = computedStyle.color;
      htmlEl.style.backgroundColor = computedStyle.backgroundColor;
      htmlEl.style.borderColor = computedStyle.borderColor;
      
      // Remove any oklch color definitions
      const cssText = htmlEl.style.cssText;
      if (cssText.includes('oklch')) {
        htmlEl.style.cssText = cssText.replace(/oklch\([^)]+\)/g, '');
      }
    });
    
    try {
      const canvas = await html2canvas(clonedNode, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: 400
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Clean up
      document.body.removeChild(tempContainer);
      
      return imgData;
    } catch (err) {
      console.error('Error during chart capture:', err);
      document.body.removeChild(tempContainer);
      return null;
    }
  } catch (error) {
    console.error('Error setting up chart capture:', error);
    return null;
  }
}

async function generateManagerReport(
  doc: any, 
  data: any, 
  autoTable: any,
  chartRefs?: Record<string, React.RefObject<HTMLDivElement | null>>
) {
  let currentY = 55;
  
  // Add summary metrics
  doc.setFontSize(14);
  doc.setTextColor(60);
  doc.text('Summary', 14, currentY);
  currentY += 8;
  
  // Create a summary table
  autoTable(doc, {
    startY: currentY,
    head: [['Metric', 'Value']],
    body: [
      ['Total Employees', data.employees.total],
      ['Assigned Employees', data.employees.assigned],
      ['Unassigned Employees', data.employees.not_assigned],
      ['Active Projects', data.projects.active],
      ['Average Assignment', `${(data.assignment.average_assignment_percentage * 100).toFixed(1)}%`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [117, 0, 192], textColor: 255 },
  });
  
  currentY = (doc as any).lastAutoTable?.finalY + 15 || currentY + 40;
  
  // Add employees by role chart if available
  if (chartRefs?.employeesByRole) {
    const chartImg = await captureChart(chartRefs.employeesByRole);
    if (chartImg) {
      doc.setFontSize(14);
      doc.setTextColor(60);
      doc.text('Employees by Role', 14, currentY);
      currentY += 8;
      
      doc.addImage(chartImg, 'PNG', 14, currentY, 180, 90);
      currentY += 100;
    } else {
      console.log('Failed to capture employeesByRole chart');
    }
  } else {
    // Add employees by role as table if chart not available
    doc.setFontSize(14);
    doc.setTextColor(60);
    doc.text('Employees by Role', 14, currentY);
    currentY += 8;
    
    autoTable(doc, {
      startY: currentY,
      head: [['Role', 'Count']],
      body: Object.entries(data.employees.by_role).map(([role, count]) => [role, count]),
      theme: 'grid',
      headStyles: { fillColor: [117, 0, 192], textColor: 255 },
    });
    
    currentY = (doc as any).lastAutoTable?.finalY + 15 || currentY + 40;
  }
  
  // Check if we need a new page
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }
  
  // Rest of function remains the same but with additional console.log for debugging chart capturing
  // Add project skills chart if available
  if (chartRefs?.topProjectSkills) {
    const chartImg = await captureChart(chartRefs.topProjectSkills);
    if (chartImg) {
      doc.setFontSize(14);
      doc.setTextColor(60);
      doc.text('Top Project Skills', 14, currentY);
      currentY += 8;
      
      doc.addImage(chartImg, 'PNG', 14, currentY, 180, 90);
      currentY += 100;
    } else {
      console.log('Failed to capture topProjectSkills chart');
    }
  } else if (data.skills.top_7_project_skills.length > 0) {
    // Add top skills as table if chart not available
    doc.setFontSize(14);
    doc.setTextColor(60);
    doc.text('Top Project Skills', 14, currentY);
    currentY += 8;
    
    autoTable(doc, {
      startY: currentY,
      head: [['Skill', 'Count']],
      body: data.skills.top_7_project_skills.map((skill: any) => [
        skill.skill_name, skill.count
      ]),
      theme: 'grid',
      headStyles: { fillColor: [117, 0, 192], textColor: 255 },
    });
    
    currentY = (doc as any).lastAutoTable?.finalY + 15 || currentY + 40;
  }
  
  // Check if we need a new page
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }
  
  // Add assignment overview chart if available
  if (chartRefs?.assignmentOverview) {
    const chartImg = await captureChart(chartRefs.assignmentOverview);
    if (chartImg) {
      doc.setFontSize(14);
      doc.setTextColor(60);
      doc.text('Assignment Overview', 14, currentY);
      currentY += 8;
      
      doc.addImage(chartImg, 'PNG', 14, currentY, 180, 90);
      currentY += 100;
    } else {
      console.log('Failed to capture assignmentOverview chart');
    }
  }
  
  // Check if we need a new page
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }
  
  // Add employees by seniority chart if available
  if (chartRefs?.employeesBySeniority) {
    const chartImg = await captureChart(chartRefs.employeesBySeniority);
    if (chartImg) {
      doc.setFontSize(14);
      doc.setTextColor(60);
      doc.text('Employees by Seniority', 14, currentY);
      currentY += 8;
      
      doc.addImage(chartImg, 'PNG', 14, currentY, 180, 90);
      currentY += 100;
    } else {
      console.log('Failed to capture employeesBySeniority chart');
    }
  } else if (data.employees.by_seniority.length > 0) {
    // Add seniority as table if chart not available
    doc.setFontSize(14);
    doc.setTextColor(60);
    doc.text('Employees by Seniority', 14, currentY);
    currentY += 8;
    
    autoTable(doc, {
      startY: currentY,
      head: [['Years of Experience', 'Count']],
      body: data.employees.by_seniority.map((item: any) => [
        item.seniority === 0 ? 'Not specified' :
          item.seniority === 1 ? '1 year' : `${item.seniority} years`,
        item.count
      ]),
      theme: 'grid',
      headStyles: { fillColor: [117, 0, 192], textColor: 255 },
    });
    
    currentY = (doc as any).lastAutoTable?.finalY + 15 || currentY + 40;
  }
  
  // Check if we need a new page
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }
  
  // Add top projects by employees chart if available
  if (chartRefs?.topProjectsByEmployees && data.projects.top_5_by_employees.length > 0) {
    const chartImg = await captureChart(chartRefs.topProjectsByEmployees);
    if (chartImg) {
      doc.setFontSize(14);
      doc.setTextColor(60);
      doc.text('Top Projects by Employees', 14, currentY);
      currentY += 8;
      
      doc.addImage(chartImg, 'PNG', 14, currentY, 180, 90);
    } else {
      console.log('Failed to capture topProjectsByEmployees chart');
    }
  } else if (data.projects.top_5_by_employees.length > 0) {
    // Add top projects as table if chart not available
    doc.setFontSize(14);
    doc.setTextColor(60);
    doc.text('Top Projects by Employees', 14, currentY);
    currentY += 8;
    
    autoTable(doc, {
      startY: currentY,
      head: [['Project', 'Employee Count']],
      body: data.projects.top_5_by_employees.map((project: any) => [
        project.project_name, project.employee_count
      ]),
      theme: 'grid',
      headStyles: { fillColor: [117, 0, 192], textColor: 255 },
    });
  }
}

async function generateTFSReport(
  doc: any, 
  data: any, 
  autoTable: any,
  chartRefs?: Record<string, React.RefObject<HTMLDivElement | null>>
) {
  let currentY = 55;
  
  // Add summary metrics
  doc.setFontSize(14);
  doc.setTextColor(60);
  doc.text('Summary', 14, currentY);
  currentY += 8;
  
  // Create a summary table
  autoTable(doc, {
    startY: currentY,
    head: [['Metric', 'Value']],
    body: [
      ['Unassigned Employees', data.employees.not_assigned],
      ['Pending Assignment Requests', data.requests.pending_assignments],
    ],
    theme: 'grid',
    headStyles: { fillColor: [117, 0, 192], textColor: 255 },
  });
  
  currentY = (doc as any).lastAutoTable?.finalY + 15 || currentY + 40;
  
  // Add missing employees chart if available
  if (chartRefs?.missingEmployees && data.projects.top_5_missing_employees.length > 0) {
    const chartImg = await captureChart(chartRefs.missingEmployees);
    if (chartImg) {
      doc.setFontSize(14);
      doc.setTextColor(60);
      doc.text('Projects With Missing Employees', 14, currentY);
      currentY += 8;
      
      doc.addImage(chartImg, 'PNG', 14, currentY, 180, 90);
      currentY += 100;
    } else {
      console.log('Failed to capture missingEmployees chart');
    }
  } else if (data.projects.top_5_missing_employees.length > 0) {
    // Add missing employees as table if chart not available
    doc.setFontSize(14);
    doc.setTextColor(60);
    doc.text('Projects With Missing Employees', 14, currentY);
    currentY += 8;
    
    autoTable(doc, {
      startY: currentY,
      head: [['Project', 'Missing Employees']],
      body: data.projects.top_5_missing_employees.map((project: any) => [
        project.project_name, project.missing
      ]),
      theme: 'grid',
      headStyles: { fillColor: [117, 0, 192], textColor: 255 },
    });
    
    currentY = (doc as any).lastAutoTable?.finalY + 15 || currentY + 40;
  }
  
  // Check if we need a new page
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }
  
  // Add project skills chart if available
  if (chartRefs?.topProjectSkills && data.skills.top_7_project_skills.length > 0) {
    const chartImg = await captureChart(chartRefs.topProjectSkills);
    if (chartImg) {
      doc.setFontSize(14);
      doc.setTextColor(60);
      doc.text('Top Project Skills', 14, currentY);
      currentY += 8;
      
      doc.addImage(chartImg, 'PNG', 14, currentY, 180, 90);
      currentY += 100;
    } else {
      console.log('Failed to capture topProjectSkills chart');
    }
  } else if (data.skills.top_7_project_skills.length > 0) {
    // Add top skills as table if chart not available
    doc.setFontSize(14);
    doc.setTextColor(60);
    doc.text('Top Project Skills', 14, currentY);
    currentY += 8;
    
    autoTable(doc, {
      startY: currentY,
      head: [['Skill', 'Count']],
      body: data.skills.top_7_project_skills.map((skill: any) => [
        skill.skill_name, skill.count
      ]),
      theme: 'grid',
      headStyles: { fillColor: [117, 0, 192], textColor: 255 },
    });
    
    currentY = (doc as any).lastAutoTable?.finalY + 15 || currentY + 40;
  }
  
  // Check if we need a new page
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }
  
  if (chartRefs?.assignmentOverview) {
    const chartImg = await captureChart(chartRefs.assignmentOverview);
    if (chartImg) {
      doc.setFontSize(14);
      doc.setTextColor(60);
      doc.text('Assignment Overview', 14, currentY);
      currentY += 8;
      
      doc.addImage(chartImg, 'PNG', 14, currentY, 180, 90);
    } else {
      console.log('Failed to capture assignmentOverview chart');
    }
  }
}