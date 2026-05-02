import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckBadgeIcon, ArrowDownTrayIcon, XMarkIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import { formatCLP } from '../../utils/format'

export default function Receipt({ reservations, total }) {
  const navigate = useNavigate()
  console.log('Reservations received:', reservations)
  const [downloadingReceipt, setDownloadingReceipt] = useState(false)
  const calculatedTotal = reservations.reduce((sum, res) => sum + (res.totalPriceCLP || 0), 0)

  const downloadReceiptPDF = async () => {
    setDownloadingReceipt(true)
    try {
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      pdf.setFillColor(59, 130, 246)
      pdf.rect(0, 0, pageWidth, 30, 'F')
      
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(24)
      pdf.text('RECIBO DE PAGO', pageWidth / 2, 15, { align: 'center' })
      pdf.setFontSize(10)
      pdf.text(`Fecha: ${new Date().toLocaleString('es-CL')}`, pageWidth / 2, 22, { align: 'center' })
      
      let yPosition = 40
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(11)
      pdf.setFont(undefined, 'bold')
      pdf.text('Reservas Confirmadas', 10, yPosition)
      
      yPosition += 12
      pdf.setFont(undefined, 'normal')
      pdf.setFontSize(9)

      reservations.forEach((reservation, idx) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage()
          yPosition = 15
        }
        
        pdf.setFillColor(240, 244, 250)
        pdf.rect(10, yPosition - 5, pageWidth - 20, 35, 'F')
        
        pdf.setFont(undefined, 'bold')
        pdf.text(`Reserva #${idx + 1}: ${reservation.reserveId}`, 12, yPosition)
        
        pdf.setFont(undefined, 'normal')
        yPosition += 6
        pdf.text(`Paquete: ${reservation.packageName || 'Sin Nombre'}`, 12, yPosition)
        yPosition += 5
        pdf.text(`Pasajeros: ${reservation.passangerCount}`, 12, yPosition)
        yPosition += 5
        pdf.text(`Check-in: ${new Date(reservation.reservedCheckIn).toLocaleDateString('es-CL')}`, 12, yPosition)
        yPosition += 5
        pdf.text(`Check-out: ${new Date(reservation.reservedCheckOut).toLocaleDateString('es-CL')}`, 12, yPosition)
        yPosition += 5
        pdf.setFont(undefined, 'bold')
        pdf.text(`Valor: ${formatCLP(reservation.totalPriceCLP)}`, 12, yPosition)
        
        yPosition += 12
      })
      
      yPosition += 5
      pdf.setDrawColor(150, 150, 150)
      pdf.line(10, yPosition, pageWidth - 10, yPosition)
      
      yPosition += 8
      pdf.setFontSize(12)
      pdf.setFont(undefined, 'bold')
      pdf.setTextColor(59, 130, 246)
      pdf.text(`TOTAL: ${formatCLP(calculatedTotal)}`, pageWidth / 2, yPosition, { align: 'center' })
      
      yPosition += 15
      pdf.setTextColor(100, 100, 100)
      pdf.setFontSize(8)
      pdf.setFont(undefined, 'normal')
      pdf.text('Gracias por tu compra. Este recibo es tu confirmación de pago.', pageWidth / 2, yPosition, { align: 'center' })
      
      const fileName = `Recibo_${reservations[0]?.reserveId || 'Pago'}_${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)
    } catch (err) {
      console.error('Error exporting receipt PDF:', err)
    } finally {
      setDownloadingReceipt(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-surface-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Success Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white flex items-start justify-between">
          <div className="flex items-start gap-3">
            <CheckBadgeIcon className="w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h1 className="text-2xl font-bold">¡Pago Aprobado!</h1>
              <p className="text-primary-100 text-sm mt-1">Tu reserva ha sido confirmada exitosamente</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/my-reservations')}
            className="text-primary-100 hover:text-white transition"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {reservations.map((reservation, idx) => (
            <div key={idx} className="border border-surface-200 dark:border-surface-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                  Reserva #{idx + 1}
                </h3>
                <span className="text-xs px-3 py-1 bg-success/20 text-success rounded-full font-medium">
                  ID: {reservation.reserveId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-surface-500 dark:text-surface-400 uppercase font-semibold mb-1">
                    Paquete
                  </p>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">
                    {reservation.packageName || 'Sin Nombre'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-surface-500 dark:text-surface-400 uppercase font-semibold mb-1">
                    Pasajeros
                  </p>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">
                    {reservation.passangerCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-surface-500 dark:text-surface-400 uppercase font-semibold mb-1">
                    Check-in
                  </p>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">
                    {new Date(reservation.reservedCheckIn).toLocaleDateString('es-CL')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-surface-500 dark:text-surface-400 uppercase font-semibold mb-1">
                    Check-out
                  </p>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">
                    {new Date(reservation.reservedCheckOut).toLocaleDateString('es-CL')}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-200/50 dark:border-surface-700/50">
                <p className="text-xs text-surface-500 dark:text-surface-400 uppercase font-semibold mb-1">
                  Valor de Reserva
                </p>
                <p className="text-lg font-bold text-primary-600">
                  {formatCLP(reservation.totalPriceCLP)}
                </p>
              </div>
            </div>
          ))}

          <div className="bg-surface-50 dark:bg-surface-700/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-surface-600 dark:text-surface-400 font-medium">Total Pagado</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                {formatCLP(calculatedTotal)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="w-4 h-4 text-blue-600" />
            <p className="font-semibold">Fecha de pago</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <button
              onClick={downloadReceiptPDF}
              disabled={downloadingReceipt}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-400 text-white rounded-xl font-medium transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              {downloadingReceipt ? 'Descargando...' : 'Descargar Recibo'}
            </button>
            <Link
              to="/my-reservations"
              className="flex items-center justify-center px-4 py-3 bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-900 dark:text-white rounded-xl font-medium transition-colors"
            >
              Ver Mis Reservas
            </Link>
          </div>

          <button
            onClick={() => navigate('/search')}
            className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl font-medium transition-colors"
          >
            Seguir Explorando
          </button>
        </div>
      </div>
    </div>
  )
}