import { ActivatedRoute, Router } from '@angular/router'
import { Component, OnInit } from '@angular/core'

import { Account } from '../model/account'
import { ServiceAccount } from '../service/service-account'
import { ServiceExcel } from '../service/service-excel'
import { Transaction } from '../model/transaction'

const newLocal = 'fecha'
@Component({
  selector: 'app-views-transactions',
  templateUrl: './views-transactions.component.html',
  styleUrls: ['./views-transactions.component.css'],
})
export class ViewsTransactionsComponent implements OnInit {
  accountKey: string
  account: Account
  service: ServiceAccount
  transactionsOutput = []
  transactionsInput = []
  panelOpenTransaction = false

  constructor(
    private route: Router,
    private ruteActive: ActivatedRoute,
    private serviceAccount: ServiceAccount,
    private serviceExcel: ServiceExcel
  ) {
    this.service = serviceAccount
    this.account = null
    this.accountKey = this.ruteActive.snapshot.paramMap.get('id')
  }

  ngOnInit(): void {
    this.loadAccount()
  }
  backToAccounts(): void {
    this.route.navigate(['/admin/cuentas'])
  }
  loadAccount() {
    this.serviceAccount.getAccount(this.accountKey, data => {
      this.account = new Account(data)
      this.loadTransaction(this.account)
    })
  }

  loadTransaction(account: Account) {
    account.transactions.forEach(transaction => {
      if (transaction.type === 1) {
        this.transactionsOutput.push(transaction)
      } else {
        this.transactionsInput.push(transaction)
      }
    })
  }
  getDataTransactions(): any {
    const data = []
    let data2 = {}
    this.account.transactions.forEach(t => {
      data2 = {
        Fecha: t.getDateFormat(),
        Tipo: t.type === 1 ? 'Salida' : 'Entrada',
        Estado: t.state === 0 ? 'Pendiente' : 'Realizada',
        Nombre: t.shortDescription,
        Descripcion: t.description,
        Monto: t.amount,
      }
      data.push(data2)
    })
    return data
  }

  exportAsXLSX(): void {
    this.serviceExcel.exportAsExcelFile(
      this.getDataTransactions(),
      'Historial_De_Transacciones_'
    )
  }
}
