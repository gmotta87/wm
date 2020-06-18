import React from 'react';
import logo from './assets/webmotors-logo.png';
import './App.css';
import loading from '../src/assets/loading.gif';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    const year = (new Date()).getFullYear();
    this.years = Array.from(new Array(40),(val, index) => index + year);
    this.state = {
      marcas:[],
      cidades:[],
      modelos:[],
      precos:[],
      versoes:[],
      marcaSel:null,
      modeloSel:null,
      cidadeSel:null,
      isLoading:true,
      loadingCidades:false,
      page1:[],
      page2:[],
      veiculos:[],
      loadingVeiculos:false,
    };
  }


  componentDidMount() {
    this.fetchMarcas();
    this.fetchCidades();
    this.fetchAllVeiculos();
  }


  async fetchMarcas() {
    await fetch(`http://desafioonline.webmotors.com.br/api/OnlineChallenge/Make`)
       .then(response => response.json())
       .then(data =>
         this.setState({
           marcas: data
         })
       )
       .catch(error => this.setState({ error, isLoading: false }));
   }
 
  async fetchCidades() {
     this.setState({loadingCidades:true});
     await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/distritos`)
       .then(response => response.json())
       .then(data =>
         this.setState({
           cidades: data,
           loadingCidades:false
         })        
       )
       .catch(error => this.setState({ error, isLoading: false }));
   }

   async fetchModelos(marca) {
     
    await fetch(`http://desafioonline.webmotors.com.br/api/OnlineChallenge/Model?MakeID=${marca}`)
      .then(response => response.json())
      .then(data =>
        this.setState({
          modelos: data,
          loadingCidades:false
      })        
      )
      .catch(error => this.setState({ error, isLoading: false }));
  }


  async fetchVersoes(modelo) {
 
   await fetch(`http://desafioonline.webmotors.com.br/api/OnlineChallenge/Version?ModelID=${modelo}`)
     .then(response => response.json())
     .then(data =>
       this.setState({
         versoes: data
     })        
     )
     .catch(error => this.setState({ error, isLoading: false }));
     
 }


 async fetchVeiculos(page) {
 
  await fetch(`http://desafioonline.webmotors.com.br/api/OnlineChallenge/Vehicles?Page=${page}`)
    .then(response => response.json())
    .then(data =>
      this.setState({
        veiculos: data
    })        
    );
}

async fetchAllVeiculos() {
  this.setState({loadingVeiculos:true});
  for (let i = 0; i < 3; i++) {
    let pageNumber = 'page'+i;
    await fetch(`http://desafioonline.webmotors.com.br/api/OnlineChallenge/Vehicles?Page=${i}`)
    .then(response => response.json())
    .then(data => this.setState({[pageNumber]:data}))
  }      
 
  var veiculos = [];
  var p1 = this.state.page1;
  var p2 = this.state.page2;
  var precos = [];
  
  for (let i = 0; i < p2.length; i++) {
    p1.push(p2[i]);
  }

  veiculos.push(p1);
  this.setState({veiculos:veiculos});
  this.setState({loadingVeiculos:false});
  for (let e = 0; e < veiculos[0].length; e++) {
    precos.push(veiculos[0][e].Price)
  }

  var distinctPrices = [...new Set(precos)] 
  this.setState({precos:distinctPrices})
}

 changeCidade(e){
    this.setState({cidadeSel:e.currentTarget.value});
 }

 changeMarca(e){
   this.setState({marcaSel:e.currentTarget.value});
   this.fetchModelos(e.currentTarget.value);
 }

 changeModelo(e){
    this.setState({modeloSel:e.currentTarget.value});
    this.fetchVersoes(e.currentTarget.value);
  }

 changeVersoes(e){
     this.setState({versaoSel:e.currentTarget.value});
 }

 resetFiltro(e){
    this.setState({
      cidadeSel:null,
      raioSel:null,
      marcaSel:null,
      modeloSel:null,
      versaoSel:null,
      anoSel:null,
      kmSel:null,
      precoSel:null
    });
  }
  
  render() {

  return (
 
   <div className="App">
   
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      <div className="wrap-sec1">
          
            <div className="col">
              
              <div className="flex align-left">
                <p>COMPRAR</p>
                <h1>CARROS</h1>
              </div>
            
              <div className="flex align-left">
                <p>COMPRAR</p>
                <h1>MOTOS</h1>
              </div>

            </div>

            <div className="col" style={{display: 'flex', alignItems: 'flex-end'}}>
              <button>Vender meu carro</button>
            </div>
     
     </div>


     <div className="wrap-sec2">
        
         <div className="wrap-chk">
           <div>
             <label>Novos</label>
             <input type="checkbox" name="chk-novos"/>
           </div>
           <div>
             <label>Usados</label>
             <input type="checkbox" name="chk-usados"/>
           </div>           
         </div>

         <div className="wrap-inputs">
          
            <div className="col column">
            
                <div className="wrap-fields1">                 
                  
                  <div style={{position:'relative'}}>
                
                    {this.state.loadingCidades?<img className="loading-select" src={require('./assets/loading.gif')} />:''}
                  
                    <select id="cidade" name="cidade" onChange={(e)=>this.changeCidade(e)}>
                    <option disabled selected value="Cidade">Cidade</option>  
                    {this.state.cidades.length && this.state.cidades.length>0?this.state.cidades.map((item) => <option key={item.id} value={item.id}>{item.municipio.nome}</option>):''}
                    </select>
                
                  </div>
                
                  <select id="raio" name="raio">   
                      <option disabled selected value="Raio">Raio</option>                   
                      <option value="10"> 10 </option>
                      <option value="20"> 20 </option>
                      <option value="30"> 30 </option>
                      <option value="40"> 40 </option>
                      <option value="50"> 50 </option>
                      <option value="Mais"> Mais </option>
                   </select>
                </div>
                
                <div className="wrap-fields2">
                    <select id="ano" name="ano" className="col-50">
                    <option disabled selected value="Ano">Ano</option>  
                      {this.years.map((year, index) => {return <option key={`year${index}`} value={year}>{year}</option>})}
                    </select>

                    <select id="preco" name="preco" className="col-50">
                     <option disabled selected value="Valor">Valor</option>                            
                      {this.state.precos && this.state.precos.length>0?this.state.precos.map((item) => <option key={item} value={item}>R$ {item}</option>):''}                    
                    </select>
                </div>
          </div>
           
           <div className="col column">
                  <div className="wrap-fields3">
                      <select id="marca" name="marca" onChange={(e)=>this.changeMarca(e)}>
                      <option disabled selected value="marca">Marca</option>        
                        {this.state.marcas && this.state.marcas.length>0?this.state.marcas.map((item) => <option key={item.ID} value={item.ID}>{item.Name}</option>):''}
                      </select>

                      <select id="modelo" name="modelo" onChange={(e)=>this.changeModelo(e)}>
                        <option disabled selected value="Modelo">Modelo</option>        
                        {this.state.modelos.length>0?this.state.modelos.map((item) => <option key={item.ID} value={item.ID}>{item.Name}</option>):''}
                      </select>
                  </div>

                  <div className="wrap-fields4">
                      <select id="versoes" name="versoes" onChange={(e)=>this.changeVersoes(e)}>
                        <option disabled selected value="versao">Versão</option>        
                        {this.state.versoes && this.state.versoes.length>0?this.state.versoes.map((item) => <option key={item.ID} value={item.ID}>{item.Name}</option>):''}
                      </select>
                  </div>
           </div>

         </div>
      </div>

      <div className="wrap-sec3">
          <div className="col">
              <label className="lbl-busca-avancada">Busca Avançada</label>
          </div>        
          <div className="col wrap-btn-oferta" style={{ display: 'flex', alignItems: 'center'}}>
              <label onClick={(e)=>this.resetFiltro(e)}>Limpar Filtros </label>
              <button className="btn-ofertas">VER OFERTAS</button>
          </div>        
      </div>
      {this.state.loadingVeiculos?<img className="loading-veiculos" src={require('./assets/loadingV.gif')} />:''}
      <div className="results">
          
            {this.state.veiculos && this.state.veiculos.length>0?this.state.veiculos[0].map((item) => 
            
              <div className="wrapCar" key={item.ID} value={item.ID}>
              <img className="thumb-car" src={item.Image}/>
                <h1>{item.Model}</h1>
                <p>{item.Version}</p>
                <p>R$ {item.Price}</p>
                <p>KM: {item.KM}</p>
                <p>Ano: {item.YearModel}</p>
              </div>
        
            ):''}        
      </div>

    </div> //fim da div App
  );
}

}
