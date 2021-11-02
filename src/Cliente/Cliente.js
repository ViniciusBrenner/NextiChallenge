import './Cliente.css';

import userIcon from "../img/userLogo.png";
import addUserIcon from "../img/addUserLogo.png";

import React, { Component } from "react";

export default class LogIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      clients:[],

      //controle de cards
      atualizar:null,
      adicionar: false,

    };

    this.newUserSubmit             = this.newUserSubmit.bind(this);
    this.newNameHandleChange       = this.newNameHandleChange.bind(this);
    this.newCpfHandleChange        = this.newCpfHandleChange.bind(this);
    this.newNascimentoHandleChange = this.newNascimentoHandleChange.bind(this);

    this.updateUserSubmit             = this.updateUserSubmit.bind(this);
    this.updateNameHandleChange       = this.updateNameHandleChange.bind(this);
    this.updateCpfHandleChange        = this.updateCpfHandleChange.bind(this);
    this.updateNascimentoHandleChange = this.updateNascimentoHandleChange.bind(this);
  }

  async updateUserSubmit(){
    let address = '/api/usuario/atualizar/' + this.state.atualizar + '/'+ this.state.updateNameField + '/' + this.state.updateCpfField + '/' + this.state.updateNascimentoField.replaceAll('/', '.');
    await fetch(address);
    await this.listAction();

    //alert("foi:" + address);
    this.updateButton(false);

  }
  updateNameHandleChange(event){
    this.setState({updateNameField: event.target.value});
  }
  updateCpfHandleChange(event){
    let input = this.cpfFilter(event.target.value);

    if (input !== null)
      this.setState({updateCpfField: input});
  }
  updateNascimentoHandleChange(event){
    this.setState({updateNascimentoField: event.target.value});
  }

  updateButton(param) {
    this.setState({ atualizar: param });
    this.setState({ updateNameField: '' });
    this.setState({ updateCpfField: '' });
    this.setState({ updateNascimentoField: '' });
  }


  async newUserSubmit(){
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "nome": this.state.newNameField,
        "cpf": this.state.newCpfField,
        "dataNascimento": this.state.newNascimentoField
      })
    };

    //alert("eNVIEI: " + this.state.newNameField + this.state.newCpfField + this.state.newNascimentoField )
    await fetch('/api/usuario/incluir/', requestOptions);
    await this.listAction();

    this.setState({ newNameField: '' });
    this.setState({ newCpfField: '' });
    this.setState({ newNascimentoField: '' });

  }

  newNameHandleChange(event){
    this.setState({newNameField:event.target.value});
  }

  newCpfHandleChange(event){
    let input = this.cpfFilter(event.target.value);
    
    if (input !== null)
    this.setState({newCpfField:input});
  }
  newNascimentoHandleChange(event){
    this.setState({newNascimentoField:event.target.value});
  }

  cpfFilter(input){
    const allowedChars = "0123456789";
    
    //--Backspace
    if (input.charAt(input.length - 1) === String.fromCharCode(0x08)){
      if ((input.charAt(input.length - 2) === ".") || (input.charAt(input.length - 2) === "-"))
        input = input.substring(0, input.length - 3);//--Remove o backspace, os ./- e o char
      else
        input = input.substring(0, input.length - 2);//--Remove o backspace e o char
    }
    //--Remove as letras e os simbolos
    else if (!allowedChars.includes(input.charAt(input.length - 1)))
      input = input.substring(0, input.length - 1);

    
    if (input.charAt(3) !== "." && input.length>=4)
      input = input.substring(0, 3) +"."+ input.substring(4, input.length - 1);

    else if (input.charAt(7) !== "." && input.length >= 8)
      input = input.substring(0, 7) + "." + input.substring(8, input.length - 1);

    else if (input.charAt(11) !== "-" && input.length >= 12)
      input = input.substring(0, 11) + "-" + input.substring(12, input.length - 1);

    
    if ((input.length <= 14))
      return input;
    
    return null;
  }
 

  async componentDidMount() {
    this.listAction();
  }

  async listAction(){
    const response = await fetch('/api/usuario/listar');
    const body = await response.json();
    this.setState({ clients: body });
  }

  async deleteButton(param){
    await fetch('/api/usuario/apagar/'+param);
    await this.listAction();
  }

  render() {
    const { clients } = this.state;
    return (
      <div className="Cliente">
        <div className="Card">  
          <h2>Usuarios:</h2>
          
          <div className="CardDisplay">

            <div className='UserCard'>

              <div className="UserLeft">
                <img alt="logo" className="userIcon" src={addUserIcon} />
              </div> 

              <div className="userRight">
                <form className="UserRight"
                  onSubmit={this.newUserSubmit}>

                  <input 
                    className="InputBox"
                    type="text"
                    value={this.state.newNameField}
                    onChange={this.newNameHandleChange}
                    placeholder="Nome" />

                  <input  
                    className="InputBox"
                    type="text"
                    value={this.state.newCpfField}
                    onChange={this.newCpfHandleChange}
                    placeholder="cpf" />

                  <input  
                    className="InputBox"
                    type="date"
                    value={this.state.newNascimentoField}
                    onChange={this.newNascimentoHandleChange}
                    placeholder="Nascimento" />

                  <div className="UserButtons">
                    <input href="#" 
                      class="DeleteButton"
                      type="submit"
                      value="Adicionar"/>
                  </div>
                </form>
              </div>
            </div>
              {clients.map(client =>
                
                <div className='UserCard' key={client.id}>
                  
                  <div className="UserLeft">
                    <img alt="logo" className="userIcon" src={userIcon} />
                  </div>


                  {(this.state.atualizar!==client.id) &&<div className="UserRight">
                    <div><h2>{client.nome}</h2></div>
                    <div>CPF: {client.cpf}</div>
                    <div>Data de Nascimento: {client.dataNascimento}</div>

                    <div className="UserButtons"> 
                      <a href="#" class="DeleteButton" onClick={() => {this.updateButton(client.id)}}>Atualizar</a> 
                      <div style={{flex:1}}></div>
                      <a href="#" class="DeleteButton" onClick={() => { this.deleteButton(client.id) }}>Apagar</a>
                    </div>
                   
                  </div>}
                  
                  {(this.state.atualizar === client.id) && <form className="UserRight"
                    onSubmit={this.updateUserSubmit}>

                    <input 
                      className="InputBox"
                      type="text"
                      value={this.state.updateNameField}
                      onChange={this.updateNameHandleChange}
                      placeholder="Nome" />

                    <input 
                      className="InputBox"
                      type="text"
                      value={this.state.updateCpfField}
                      onChange={this.updateCpfHandleChange}
                      placeholder="cpf" />

                    <input 
                      className="InputBox"
                      type="date"
                      value={this.state.updateNascimentoField}
                      onChange={this.updateNascimentoHandleChange}
                      placeholder="Nascimento"/>

                    <div className="UserButtons">
                      <a href="#" class="DeleteButton" 
                                  onClick={() => { this.updateButton(null) }}>
                          Cancelar
                      </a>
                      <div style={{ flex: 1 }}></div>
                      <input href="#"
                             class="DeleteButton" 
                             type="submit" 
                             value="Confirmar" />
                    </div>  
                  </form>}

                </div>

              )}
          </div>
        </div>
      </div>
    );
  }
}


