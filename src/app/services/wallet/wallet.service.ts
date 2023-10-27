import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Wallet } from 'src/app/models/wallet.module';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor(private http: HttpClient) {}
  async addWallet(wallet: Wallet) {
    return await firstValueFrom(
      this.http.post(`${environment.api}/wallet/addWallet`, wallet)
    );
  }
  async getWallets(page: number, pageSize: number) {
    return await firstValueFrom(
      this.http.get(
        `${environment.api}/wallet/getWallets?page=${page}&pageSize=${pageSize}`
      )
    );
  }
}
