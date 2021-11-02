import './Pedido.css';

import OrderIcon    from "../img/productLogo.png";
import addOrderIcon from "../img/productLogo.png";

import React, { Component } from "react";

export default class LogIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Orders:[],
      Products: [],
      Clients: [],

      productList:[],

      //controle de cards
      atualizar:null,
      adicionar: false,
    };

    this.newOrderSubmit = this.newOrderSubmit.bind(this);
    this.updateOrderSubmit = this.updateOrderSubmit.bind(this);
    
    this.selectClientHandleChange = this.selectClientHandleChange.bind(this);
    this.selectProductHandleChange = this.selectProductHandleChange.bind(this);
    this.includeProductInListAction = this.includeProductInListAction.bind(this);
    
    this.selectClientUpdateHandleChange = this.selectClientUpdateHandleChange.bind(this);
  }
  
  async updateOrderSubmit() {
    //this.state.productList;
    //this.state.atualizar;
    await fetch('/api/pedido/alterarCliente/' + this.state.atualizar + '/' + parseInt(this.state.selectedUpdateClient));

    this.state.productList.map(async item => { await fetch('/api/pedido/adicionarProduto/' + this.state.atualizar +'/'+ parseInt(item.id));
                                               console.log("Enviado: " + item.nome); 
                                             });
    //--1Desliga' o modo de atualização
    this.setState({productList:[],atualizar:null});
  }

  async newOrderSubmit() {
    var data = new Date();
    var dia = String(data.getDate()).padStart(2, '0');
    var mes = String(data.getMonth() + 1).padStart(2, '0');
    var ano = data.getFullYear();
    var dataAtual = dia + '/' + mes + '/' + ano;

    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "cliente": null,
        "produtos": null,
        "totalDaCompra": 0,
        "DataDaCompra": dataAtual
      })
    };
  
    await fetch('/api/pedido/incluir/', requestOptions);
    //await this.listAction();

    this.listOrders();
    this.listClients();
    this.listProduct();
    //this.setState({ selectedNewClient: '' });

  }

  selectClientUpdateHandleChange(event){
    this.setState({ selectedUpdateClient: event.target.value });
  }

  //SELECT INPUT
  selectClientHandleChange(event){
    this.setState({selectedNewClient: event.target.value});
  }

  selectProductHandleChange(event){
    this.setState({ selectedNewProduct: event.target.value});
  }  

  includeProductInListAction(){
    const selectedId = this.state.selectedNewProduct;
    let auxList = this.state.productList;

    auxList.push(this.state.Products.find(element => element.id === parseInt(selectedId, 10)));

    this.setState({ productList:auxList});
    //alert(this.state.Products.find(element => element.id === parseInt(selectedId,10)).nome);
  }

  updateButton(param) {
    this.setState({ atualizar: param });
    //this.setState({ updateNameField: '' });
    //this.setState({ updatePriceField: '' });
    //this.setState({ updateQuantityField: '' });
    //this.setState({ updateDescriptionField: '' });
  }

  async deleteButton(param) {
    await fetch('/api/pedido/apagar/' + param);
    await this.listOrders();
  }

  async listOrders() {
    const response = await fetch('/api/pedido/listar');
    const body = await response.json();
    this.setState({ Orders: body });
  }

  async listClients(){
    const response = await fetch('/api/usuario/listar');
    const body = await response.json();
    this.setState({ Clients: body });
  }

  async listProduct(){
    const response = await fetch('/api/produto/listar');
    const body = await response.json();
    this.setState({ Products: body });
  }

  async componentDidMount() {
    await this.listClients();
    await this.listProduct();
    await this.listOrders();
  }
    



  render() {
    const Orders   = this.state.Orders;
    const Products = this.state.Products;
    const Clients  = this.state.Clients;

    return (
      <div className="Order">
        <div className="Card">  
          <h2>Pedidos:</h2>
          
          <div className="CardDisplay">

            <div className='OrderCard'>

              <div className="OrderLeft">
                <img alt="logo" className="OrderIcon" src={addOrderIcon} />
              </div> 

              <div className="OrderRight">
                <form className="OrderRight"
                  onSubmit={this.newOrderSubmit}>
                  <div className="OrderButtons">
                    <input href="#" 
                      class="DeleteButton"
                      type="submit"
                      value="Adicionar"/>
                  </div>
                </form>

              </div>
            </div>
              {Orders.map(Order =>
                
                <div className='OrderCard' key={Order.id}>
                  
                  <div className="OrderLeft">
                    <img alt="logo" className="OrderIcon" src={OrderIcon} />
                  </div>


                  {(this.state.atualizar!==Order.id) &&<div className="OrderRight">
                    <div><h2>Pedido nº: {Order.id}</h2></div>
                    <div>Data: {Order.DataDaCompra}</div>
                    <div>Cliente: {Order.cliente}</div>
                    <div>Total: {Order.produtos}</div>

                    <div className="OrderButtons"> 
                      <a href="#" class="DeleteButton" onClick={() => {this.updateButton(Order.id)}}>Atualizar</a> 
                      <div style={{flex:1}}></div>
                      <a href="#" class="DeleteButton" onClick={() => { this.deleteButton(Order.id) }}>Apagar</a>
                    </div>
                   
                  </div>}
                  
                  {(this.state.atualizar === Order.id) && <form className="OrderRight"
                    onSubmit={this.updateOrderSubmit}>
                    <div><h2>Pedido nº: {Order.id}</h2></div>
                    
                    <select id={Clients.id}
                      onChange={this.selectClientUpdateHandleChange}
                      value={this.state.selectedUpdateClient} >
                      <option >Selecione</option> {
                        Clients.map(
                          client => <option value={client.id} key={client.id}>{client.nome}</option>
                        )
                      }
                    </select>

                    Lista de Compras:

                    {this.state.productList.map(
                      product => <div>{product.nome}</div>
                    )}

                    <select id={Products.id}
                      onChange={this.selectProductHandleChange}
                      value={this.state.selectedNewProduct} >
                      <option >Selecione</option> {
                        Products.map(
                          product => <option value={product.id} key={product.id}>{product.nome}: {product.quantidade}</option>
                        )
                      }
                    </select>

                    <a onClick={this.includeProductInListAction}>AAAAAA</a>

                      Total da Compra:

                    <div className="OrderButtons">
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


