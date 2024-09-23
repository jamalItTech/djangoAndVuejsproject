from django.db import models

class Account(models.Model):
    ACCOUNT_TYPES = [
        ('ASSET', 'Asset'),
        ('LIABILITY', 'Liability'),
        ('EQUITY', 'Equity'),
        ('INCOME', 'Income'),
        ('EXPENSE', 'Expense'),
    ]

    name = models.CharField(max_length=100)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.account_type})"

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('DEBIT', 'Debit'),
        ('CREDIT', 'Credit'),
    ]

    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=6, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    date = models.DateField(auto_now_add=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.transaction_type} of {self.amount} to {self.account.name} on {self.date}"

class JournalEntry(models.Model):
    date = models.DateField()
    description = models.TextField(blank=True)
    transactions = models.ManyToManyField(Transaction, related_name='journal_entries')

    def __str__(self):
        return f"Journal Entry on {self.date}"
    
    
# models.py

from django.db import models

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.title} from {self.start_datetime} to {self.end_datetime}"
# models.py

from django.db import models

class Invoice(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='invoices')
    invoice_number = models.CharField(max_length=50, unique=True)
    invoice_date = models.DateTimeField()
    amount_due = models.DecimalField(max_digits=15, decimal_places=2)
    paid = models.BooleanField(default=False)

    def __str__(self):
        return f"Invoice {self.invoice_number} for {self.account.name}"
# models.py

from django.db import models

class Reservation(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='reservations')
    start_date = models.DateField()
    end_date = models.DateField()
    details = models.TextField(blank=True)

    def __str__(self):
        return f"Reservation from {self.start_date} to {self.end_date} for {self.account.name}"

