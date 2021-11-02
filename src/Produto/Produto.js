import './Produto.css';

import ProductIcon from "../img/productLogo.png";
import addProductIcon from "../img/addProductLogo.png";

import React, { Component } from "react";

export default class LogIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Products:[],

      

      //controle de cards
      atualizar:null,
      adicionar: false,
    };
    
    this.newProductSubmit = this.newProductSubmit.bind(this);

    this.newNameHandleChange = this.newNameHandleChange.bind(this);
    this.newDescriptionHandleChange = this.newDescriptionHandleChange.bind(this);
    this.newPriceHandleChange = this.newPriceHandleChange.bind(this);
    this.newQuantityHandleChange = this.newQuantityHandleChange.bind(this);

    
    this.updateProductSubmit = this.updateProductSubmit.bind(this);

    this.updateNameHandleChange = this.updateNameHandleChange.bind(this);
    this.updateDescriptionHandleChange = this.updateDescriptionHandleChange.bind(this);
    this.updatePriceHandleChange = this.updatePriceHandleChange.bind(this);
    this.updateQuantityHandleChange = this.updateQuantityHandleChange.bind(this);
    
  }

  async newProductSubmit() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "nome": this.state.newNameField,
        "descricao": this.state.newDescriptionField,
        "preco": this.state.newPriceField,
        "quantidade": this.state.newQuantityField
        })
      }

      await fetch('/api/produto/incluir/', requestOptions);
      await this.listAction();

    
      this.setState({newNameField       : '' });
      this.setState({ newDescriptionField : '' });
      this.setState({newPriceField      : '' });
      this.setState({newQuantityField   : '' });

    };



  async listAction() {
    const response = await fetch('/api/produto/listar');
    const body = await response.json();
    this.setState({ Products: body });
  }

  newNameHandleChange(event){
    this.setState({newNameField:event.target.value});
  }

  newDescriptionHandleChange(event){
    this.setState({newDescriptionField:event.target.value});
  }

  newPriceHandleChange  (event){
    this.setState({newPriceField:event.target.value});
  }

  newQuantityHandleChange(event){
    this.setState({newQuantityField:event.target.value});
  }

  async deleteButton(param) {
    await fetch('/api/produto/apagar/' + param);
    await this.listAction();
  }


  async updateProductSubmit(){
    let address = '/api/produto/atualizar/' + this.state.atualizar + '/' + this.state.updateNameField + '/' + this.state.updateDescriptionField + '/' + this.state.updatePriceField + '/' + this.state.updateQuantityField;
   
    await fetch(address);
    await this.listAction();

    alert("Foi?: "+ address);
    
    this.updateButton(false);
  }

  updateNameHandleChange(event){
    this.setState({updateNameField:event.target.value});
  }

  updateDescriptionHandleChange(event){
    this.setState({updateDescriptionField:event.target.value});
  }

  updatePriceHandleChange(event){
    this.setState({updatePriceField:event.target.value});
  }

  updateQuantityHandleChange(event){
    this.setState({updateQuantityField:event.target.value});
  }

  
  updateButton(param) {
    this.setState({ atualizar: param });
    this.setState({updateNameField : '' });
    this.setState({updatePriceField : '' });
    this.setState({updateQuantityField : '' });
    this.setState({ updateDescriptionField : '' });
  }

  async componentDidMount() {
    this.listAction();
  }
    



  render() {
    const { Products } = this.state;
    return (
      <div className="Produto">
        <div className="Card">  
          <h2>Produtos:</h2>
          
          <div className="CardDisplay">

            <div className='ProductCard'>

              <div className="ProductLeft">
                <img alt="logo" className="ProductIcon" src={addProductIcon} />
              </div> 

              <div className="ProductRight">
                <form className="ProductRight"
                  onSubmit={this.newProductSubmit}>

                  <input 
                    className="InputBox"
                    type="text"
                    value={this.state.newNameField}
                    onChange={this.newNameHandleChange}
                    placeholder="Nome" />

                  <input  
                    className="InputBox"
                    type="text"
                    value={this.state.newDescriptionField}
                    onChange={this.newDescriptionHandleChange}
                    placeholder="Descrição" />

                  <input  
                    className="InputBox"
                    type="number" min="0.00" max="10000.00" step="0.01"
                    value={this.state.newPriceField}
                    onChange={this.newPriceHandleChange}
                    placeholder="R$0,00" />

                  <input
                    className="InputBox"
                    type="number" min = "0"
                    value={this.state.newQuantityField}
                    onChange={this.newQuantityHandleChange}
                    placeholder="Quantidade" />

                  <div className="ProductButtons">
                    <input href="#" 
                      class="DeleteButton"
                      type="submit"
                      value="Adicionar"/>
                  </div>
                </form>
              </div>
            </div>
              {Products.map(Product =>
                
                <div className='ProductCard' key={Product.id}>
                  
                  <div className="ProductLeft">
                    <img alt="logo" className="ProductIcon" src={ProductIcon} />
                  </div>


                  {(this.state.atualizar!==Product.id) &&<div className="ProductRight">
                    <div><h2>{Product.nome}</h2></div>
                    <div>Descrição: {Product.descricao}</div>
                    <div>Preço: {Product.preco}</div>
                    <div>Quanidade: {Product.quantidade}</div>

                    <div className="ProductButtons"> 
                      <a href="#" class="DeleteButton" onClick={() => {this.updateButton(Product.id)}}>Atualizar</a> 
                      <div style={{flex:1}}></div>
                      <a href="#" class="DeleteButton" onClick={() => { this.deleteButton(Product.id) }}>Apagar</a>
                    </div>
                   
                  </div>}
                  
                  {(this.state.atualizar === Product.id) && <form className="ProductRight"
                    onSubmit={this.updateProductSubmit}>

                    <input
                      className="InputBox"
                      type="text"
                      value={this.state.updateNameField}
                      onChange={this.updateNameHandleChange}
                      placeholder="Nome" />

                    <input
                      className="InputBox"
                      type="text"
                      value={this.state.updateDescriptionField}
                      onChange={this.updateDescriptionHandleChange}
                      placeholder="Descrição" />

                    <input
                      className="InputBox"
                      type="number" min="0.00" max="10000.00" step="0.01"
                      value={this.state.updatePriceField}
                      onChange={this.updatePriceHandleChange}
                      placeholder="R$0,00" />

                    <input
                      className="InputBox"
                      type="number" min = "0"
                      value={this.state.updateQuantityField}
                      onChange={this.updateQuantityHandleChange}
                      placeholder="Quantidade" />

                    <div className="ProductButtons">
                      <input href="#"
                        class="DeleteButton"
                        type="submit"
                        value="Adicionar" />
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


