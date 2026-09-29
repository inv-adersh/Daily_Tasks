from reportlab.pdfgen import canvas


def generate_receipt_pdf(transaction_log):

    filename =f"receipt_{transaction_log.id}.pdf"

    pdf = canvas.Canvas(filename)

    pdf.drawString(100,750,"WALLET RECEIPT")
    pdf.drawString(100,700,"Transaction ID: " + str(transaction_log.id))
    pdf.drawString(100,650,"Amount: " + str(transaction_log.amount))
    pdf.drawString(100,600,"Reference Code: " + str(transaction_log.reference_code))
    pdf.drawString(100,550,"Created At: " + str(transaction_log.created_at))
    
    pdf.save()

    return filename