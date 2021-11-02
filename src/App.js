import './App.css';

import React, { Component } from "react";

import Cliente from './Cliente/Cliente.js'
import Produto from './Produto/Produto.js'
import Pedido  from './Pedido/Pedido.js'

export default class LogIn extends Component {

  constructor(props) {
    super(props);
    this.state = {page:'USUARIOS',
    };

    this.goToUsuario =this.goToUsuario.bind(this);
    this.goToProducts =this.goToProducts.bind(this);
    this.goToOrders =this.goToOrders.bind(this);
  }

  goToUsuario(){
    this.setState({page:'USUARIOS'});
  }

  goToProducts(){
    this.setState({page:'PRODUTOS'});
  }

  goToOrders(){
    this.setState({page:'PEDIDOS'});
  }

  render() {
    return (
      <div className="Wrapper">
          <div className="Header">
              <a class={this.state.page === 'USUARIOS' ? 'HeaderButtonActived' : 'HeaderButtonUnactived'} onClick={this.goToUsuario}>Usuarios</a>
              <a class={this.state.page === 'PRODUTOS' ? 'HeaderButtonActived' : 'HeaderButtonUnactived'} onClick={this.goToProducts}>Produtos</a>
              <a class={this.state.page === 'PEDIDOS'  ? 'HeaderButtonActived' : 'HeaderButtonUnactived'} onClick={this.goToOrders}>Pedidos</a>

          </div>
          
          <div className="Contents">
            {(this.state.page === 'USUARIOS') && <Cliente/>}
            {(this.state.page === 'PRODUTOS') && <Produto/>}
            {(this.state.page === 'PEDIDOS')  && <Pedido/>}
          </div>
          
      </div>
      );
  }
}


