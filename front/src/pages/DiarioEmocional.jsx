import { useState, useEffect } from 'react';
import './CSS/DiarioEmocional.css';
import seta from '../assets/reply-solid (1) 2.svg';
import Nota from '../assets/file-pen-solid 1.svg';
import Arvore from '../assets/Logo Para o Navegador do Google 4.svg';
import Relógio from '../assets/clock-regular 1.svg';
import Lixo from '../assets/Vector.svg';
import Setas from '../assets/down-left-and-up-right-to-center-solid.svg';
import SetaBaixo from '../assets/angle-down-solid.svg';

function DiarioEmocional() {
  const [notas, setNotas] = useState([]);
  const [notaAtiva, setNotaAtiva] = useState(null);
  const [textoDigitado, setTextoDigitado] = useState('');
  const [telaCheia, setTelaCheia] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const adicionarNota = () => {
    const novaNota = {
      id: Date.now(),
      titulo: "Nova Nota",
      texto: "",
      data: new Date().toLocaleDateString()
    };
    setNotas([novaNota, ...notas]);
    setNotaAtiva(novaNota);
    setTextoDigitado(novaNota.texto);
  };

  const apagarNota = () => {
    if (notaAtiva) {
      const novasNotas = notas.filter(nota => nota.id !== notaAtiva.id);
      setNotas(novasNotas);
      if (novasNotas.length > 0) {
        setNotaAtiva(novasNotas[0]);
        setTextoDigitado(novasNotas[0].texto);
      } else {
        setNotaAtiva(null);
        setTextoDigitado('');
      }
    }
  };

  const selecionarNota = (nota) => {
    setNotaAtiva(nota);
    setTextoDigitado(nota.texto);
  };

  const atualizarTextoNota = (e) => {
    const novoTexto = e.target.value;
    setTextoDigitado(novoTexto);

    if (notaAtiva) {
      const tituloGerado = novoTexto.length > 10 
        ? novoTexto.split(' ').slice(0, 4).join(' ').slice(0, 10) + "..." 
        : novoTexto.split(' ').slice(0, 4).join(' ');

      setNotaAtiva({ ...notaAtiva, texto: novoTexto, titulo: tituloGerado });
      setNotas(notas.map(nota => (nota.id === notaAtiva.id ? { ...nota, texto: novoTexto, titulo: tituloGerado } : nota)));
    }
  };

  const alternarTelaCheia = () => {
    setTelaCheia(!telaCheia);
  };

  useEffect(() => {
    if (notas.length === 0 && !notaAtiva) {
      adicionarNota();
    }
  }, [notas, notaAtiva]);

  return (
    <div className={`container-diarioemocional ${telaCheia ? 'fullscreen' : ''}`}>
      <div className='mini-lado-esquerdoDiario'>
        <button className='buttondiario'>
          <img src={seta} alt="" className='seta-diaraio'/>
        </button>
      </div>

      <div className='lado-esquerdoDiario'>
        <div className='div-cabecalhodiario'>
          <div className='cacecalhomenor'>
            <h2>Diário Emocional</h2>
            <button className='botaonovanota' onClick={adicionarNota}>
              <img src={Nota} alt="" />Nova Nota
            </button>
          </div>
          <p className='quantidadenotas'>{notas.length} notas</p>
        </div>
        
        <div className='lista-de-notas'>
          {notas.map((nota) => (
            <div key={nota.id} className={`nota-item ${notaAtiva?.id === nota.id ? 'ativa' : ''}`} onClick={() => selecionarNota(nota)}>
              <p className='nota-data'>{nota.data}</p>
              <p className='nota-titulo'>{nota.titulo}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='lado-direitoDiario'>
        <img src={Arvore} alt="" className='arvoredefundodiario'/>
        <div className='cabecalhonota'>
          <div className='datadiario'>
            <img src={Relógio} alt="" className='relogio'/>
            <p>{notaAtiva ? notaAtiva.data : "Selecione uma nota"}</p>
          </div>
          <div className='div-buts'>
            <button className='botaoapagar' onClick={apagarNota}>
              <img src={Lixo} alt="" />Apagar Nota
            </button>
            <button className='botaocomp' onClick={() => setModalAberto(true)}>
              Compartilhar <img src={SetaBaixo} alt="" className='setabaixo'/>
            </button>
            <button className='botaoaumentar' onClick={alternarTelaCheia}>
              <img src={Setas} alt="" />
            </button>
          </div>
        </div>

        <textarea 
          className='area-digitacao' 
          value={textoDigitado} 
          onChange={atualizarTextoNota} 
          placeholder="Digite aqui..."
        />
      </div>

      {modalAberto && (
        <div className='modal-compartilhar'>
          <div className='modal-content'>
            <h2>Compartilhar Nota</h2>
            <input type='email' placeholder='Adicionar participante' className='input-email' />
            <button className='botao-copiar'>Copiar Link</button>
            <button className='botao-enviar'>Enviar</button>
            <button className='botao-fechar' onClick={() => setModalAberto(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiarioEmocional;