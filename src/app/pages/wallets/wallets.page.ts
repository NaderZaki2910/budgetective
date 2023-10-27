import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  InfiniteScrollCustomEvent,
  IonModal,
  IonicModule,
} from '@ionic/angular';
import { Wallet } from 'src/app/models/wallet.module';
import { OverlayEventDetail } from '@ionic/core/components';
import { WalletService } from 'src/app/services/wallet/wallet.service';
import { AppModule } from 'src/app/app.module';
import { ComponentsModule } from '../../components/components.module';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.page.html',
  styleUrls: ['./wallets.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
  ],
})
export class WalletsPage implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;
  addWalletForm!: FormGroup;

  wallets: Wallet[] = [
    {
      id: 1,
      amount: 1000,
      name: 'test',
      owner: 'nader',
    },
  ];

  page: number = 1;
  pageSize: number = 3;
  totalItems: number = 0;

  isAlertOpen = false;
  alertErrorMessage = '';
  alertButtons = ['OK'];

  constructor(private walletService: WalletService) {}

  ngOnInit() {
    this.addWalletForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      amount: new FormControl(0, [Validators.required]),
    });

    this.getWallets();
  }

  getWallets() {
    this.walletService
      .getWallets(this.page, this.pageSize)
      .then((result) => {
        if (
          !!result['wallets' as keyof object] &&
          !!result['totalItems' as keyof object]
        ) {
          this.wallets = result['wallets' as keyof object];
          this.totalItems = result['totalItems' as keyof object];
          console.log(this.wallets, this.totalItems);
        } else {
          console.log('wrong result');
        }
      })
      .catch((err) => console.log(err));
  }

  get addWalletFormControls() {
    return this.addWalletForm.controls;
  }
  // confirm() {
  //   this.modal.dismiss(null, 'cancel');
  // }
  // cancel() {
  //   this.modal.dismiss(null, 'confirm');
  // }
  addWallet() {
    console.log(this.addWalletForm.valid);
    if (this.addWalletForm.valid) {
      var wallet: Wallet = {
        name: this.addWalletFormControls['name'].value,
        description: this.addWalletFormControls['description'].value,
        amount: this.addWalletFormControls['amount'].value,
      };
      this.walletService
        .addWallet(wallet)
        .then((result) => {
          if (result['result' as keyof Object].toString() == 'true') {
            this.modal.dismiss(null, 'confirm');
          } else {
            this.alertErrorMessage = 'Process failed. Wallet was not inserted.';
            this.setAlertOpen(true);
          }
        })
        .catch((err) => {
          console.log(err);
          if (!!err['err']) this.alertErrorMessage = err['err'].message;
          else this.alertErrorMessage = err.message;
          this.setAlertOpen(true);
        });
    }
  }
  onWillPresentAddWallet() {
    this.addWalletForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      amount: new FormControl(0, [Validators.required]),
    });
  }
  onWillDismissAddWallet($event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
    }
  }
  setAlertOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
  pageChanged(page: number) {
    this.page = page;
    this.getWallets();
  }
}
