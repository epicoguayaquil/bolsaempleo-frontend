import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { RegistroPostulanteModalComponent } from '../registroPostulanteModal/registroPostulanteModal.component';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { LoginService, TipoRegistro } from '../servicios/login.service';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { BadgeModule } from 'primeng/badge';
import { ImageModule } from 'primeng/image';
import { environment } from '../../../../../environments/environment';
import { Usuario } from '../modelos/Usuario';
import { RegistroPersonaModalComponent } from '../registroPersonaModal/registroPersonaModal.component';
import { FormMensageErrorComponent, General, ParametrosSistemaService } from '../../../../../centroemprendimiento-lib/src/public-api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-loginModal',
  templateUrl: './loginModal.component.html',
  styleUrls: ['./loginModal.component.css'],
  standalone: true,
  imports: [ButtonModule, DialogModule, AvatarModule, RegistroPostulanteModalComponent,
    InputTextModule, CommonModule, MenuModule, FormsModule, ReactiveFormsModule, FormMensageErrorComponent,
    PasswordModule, BadgeModule, ImageModule, RegistroPersonaModalComponent, ConfirmDialogModule
  ]
})
export class LoginModalComponent implements OnInit {

  visible: boolean = false;
  vistaRegistro: boolean = false;
  @Input() permitirRegistro: boolean = true;
  @Output() registrar = new EventEmitter<any>();
  urlLogo = environment.domain + 'favicon.ico';
  logoDefault = "assets/images/user.png";
  pathUrlArchivo = "";
  usuario?:Usuario;

  loggedIn:boolean = false;
  loading:boolean = false;
  items: MenuItem[] | undefined;

  public mensajeRegistroVisible:boolean = false;

  private loginService:LoginService = inject(LoginService);
  private formBuilder:FormBuilder = inject(FormBuilder);
  private parametrosSistemaService:ParametrosSistemaService = inject(ParametrosSistemaService);

  formDatos: FormGroup;

  public tipoRegistro?:TipoRegistro;

  constructor(){
    this.formDatos =  this.formBuilder.group({
      'usuario': [null, Validators.compose([Validators.required])],
      'password': [null, Validators.compose([Validators.required])],
      'app': [null, Validators.compose([Validators.required])]
    });
  }
  
  ngOnInit() {
    this.parametrosSistemaService.getRutaArchivo().subscribe(valor => {
      this.pathUrlArchivo = valor
    });

    this.loginService.observeRegisterStatus().subscribe(isRegistrar =>{
      console.log('observeRegisterStatus:', isRegistrar);
      console.log('observeRegisterStatus mensajeRegistroVisible 1:', this.mensajeRegistroVisible);
      if(isRegistrar){
        this.vistaRegistro = true;
        this.mensajeRegistroVisible = true;
      }else{
        this.mensajeRegistroVisible = false;
      }
      console.log('observeRegisterStatus mensajeRegistroVisible 2:', this.mensajeRegistroVisible);
    });

    this.loginService.observeLoginStatus().subscribe( logged =>{
      this.loggedIn = logged;
      this.submited = false;
      this.loginService.getUser().then(usuario => {
        this.usuario = usuario;
      });
      if(!logged){
        this.showDialog();
      }
    });

    this.loginService.isAuthenticated().then( sesion =>{
      this.loggedIn = sesion;
    });
    this.loginService.getUser().then(usuario => {
      this.usuario = usuario;
    });

    this.items = [
      {
          label: 'Opciones',
          items: [
              {
                  label: 'Cerrar Sesión',
                  icon: 'pi pi-refresh',
                  command: () => {
                    this.loginService.logout();
                  }
              }
          ]
      }
    ];
  }

  ngAfterViewInit(): void {
    this.consultaRecurrenteLogin();
  }

  showDialog() {
    this.formDatos?.reset();
    this.visible = true;
    this.vistaRegistro = false;
    this.submited = false;
  }

  closeDialog() {
    this.visible = false;
    this.vistaRegistro = false;
    this.submited = false;
  }

  registrarme(){
    console.log('registrarme:');
    console.log('registrarme mensajeRegistroVisible 1:', this.mensajeRegistroVisible);
    this.visible = false
    //this.vistaRegistro = true;
    this.formDatos?.reset();
    this.registrar.emit(true);
    this.loginService.register();
  }

  registrado(event:any){
    console.log('registrado:', event);
    console.log('registrado mensajeRegistroVisible 1:', this.mensajeRegistroVisible);
    this.loginService.getToken().then( (token) => {
      console.log('registrado token:', token);
      console.log('registrado token mensajeRegistroVisible 1:', this.mensajeRegistroVisible);
      if(token){
        this.vistaRegistro = false;
        this.submited = false;
      }else{
        this.showDialog();
      }
    } );
  }

  iniciarSesion(){
    this.loading = true;
    this.formDatos?.controls['app'].setValue(this.loginService.app);
    this.submited = true;
    if(this.formDatos?.invalid){
      this.loading = false;
      return;
    }
    this.loginService.loginUser({...this.formDatos?.value}).subscribe(resultado => {
      this.loading = false;
      if(resultado){
        this.closeDialog();
      }
    });
  }

  submited: boolean = false;
  fieldIsValid (nameField:any) {
    return General.fieldIsValid(this.formDatos?.controls[nameField], this.submited);
  }

  getFoto(){
    if(this.usuario && this.usuario.foto){
      return this.pathUrlArchivo + this.usuario.foto;
    }
    return this.logoDefault;
  }

  onImageError(event: any) {
    event.target.src = this.logoDefault;
  }

  consultaRecurrenteLogin(){
    setTimeout(()=>{
      this.loginService.isAuthenticated().then( sesion =>{
        this.loggedIn = sesion;
        this.loginService.getUser().then(usuario => {
          this.usuario = usuario;
        });
        this.consultaRecurrenteLogin();
      });
    }, 500);
  }

  getTipoRegistro(tipoRegistro: string){
    return (tipoRegistro === this.loginService.tipoRegistro.toString()) && this.vistaRegistro;
  }

  cancelarRegistro(event:any){
    this.vistaRegistro = false;
  }
}
