import React, { useState } from "react";
import './CSS/TelaAgendamento.css';

const TelaAgendamento = () => {

  const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex"];

  // Função para formatar data como dd/mm/yyyy
  const formatarData = (data) => {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  // Função para calcular a data do começo da semana
  const calcularInicioDaSemana = (data) => {
    const diaDaSemana = data.getDay();
    const diferenca = diaDaSemana === 0 ? -6 : 1 - diaDaSemana; // Se for domingo (0), ajustamos para segunda-feira
    data.setDate(data.getDate() + diferenca);
    return data;
  };

  // Função para gerar as datas de segunda a sexta-feira
  const gerarDiasDaSemana = (data) => {
    const dias = [];
    for (let i = 0; i < 5; i++) {
      dias.push({ dia: diasDaSemana[i], data: formatarData(data) });
      data.setDate(data.getDate() + 1); // Avança um dia
    }
    return dias;
  };

  // Estado para controlar a data do início da semana
  const [dataInicioSemana, setDataInicioSemana] = useState(calcularInicioDaSemana(new Date()));

  // Função para alterar para a semana anterior ou próxima
  const alterarSemana = (direcao) => {
    const novaData = new Date(dataInicioSemana);
    novaData.setDate(novaData.getDate() + (direcao * 7)); // Avança ou retrocede 7 dias
    setDataInicioSemana(calcularInicioDaSemana(novaData));
  };

  const dias = gerarDiasDaSemana(new Date(dataInicioSemana));

  // Array de horários de agendamento de segunda a sexta-feira (10 horários para cada dia)
  const horariosAgendamento = {
    "Seg": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    "Ter": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    "Qua": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    "Qui": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    "Sex": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
  };

  // Estado para controlar os horários visíveis de cada dia
  const [horariosVisiveis, setHorariosVisiveis] = useState({
    "Seg": 5,
    "Ter": 5,
    "Qua": 5,
    "Qui": 5,
    "Sex": 5
  });

  // Função para mostrar mais horários
  const mostrarMaisHorarios = (dia) => {
    setHorariosVisiveis((prevState) => ({
      ...prevState,
      [dia]: Math.min(prevState[dia] + 5, horariosAgendamento[dia].length) // Garantir que o número de horários não ultrapasse o total disponível
    }));
  };

  // Função para voltar aos horários anteriores
  const mostrarMenosHorarios = (dia) => {
    setHorariosVisiveis((prevState) => ({
      ...prevState,
      [dia]: Math.max(prevState[dia] - 5, 5) // Não deixar exibir menos de 5 horários
    }));
  };

  return (
    <div className='container-tela-agendamento_geral'>
      <div className='container-tela-agendamento_esquerda'>
        <div className='container'>
          <div className='container_retangulo_um'>
            <div className='container_informações_um'>
              <div className='informações'>
                <div className='div_image'>
                  <img src="user-profile-circle.svg" alt="" />
                </div>
                <div className='container_nome_crc_button'>
                  <p className='nome_usuario'>Dr. Juan Pereira</p>
                  <div>
                    <p>CRC:111111/99</p>
                  </div>
                  <div className='div_button_chat'>
                    <button className='button_abrir_chat'>Abrir chat</button>
                  </div>
                </div>
              </div>
              <div className='logo_agendamento'>
                <img className='imagem_logo' src="Logo_sa_arvore.svg" alt="" />
              </div>
            </div>
            <div className='instrucoes_sessao'>
              <p className='titulo_instrucoes'>Instruções da sessão</p>
              <p className='instrucoes'>1-Liberado a senha para a sessão 24h antes.</p>
              <p className='instrucoes'>2-Acesso a camera necessário se for combinado com seu psicologo.</p>
              <p className='instrucoes'>3-Confirmação de sessão somente após o pagamento.</p>
            </div>
          </div>
          <div className='container_retangulo_dois'>
            <div className='container-esquerdo_retangulo_dois'>
              <p className='titulo_formacao'>Formação</p>
              <div className='div_bolinha_formacao_esquerda'>
                <img className='imagem_bolinha' src="bolinha_azul_forte.svg" alt="" />
                <p className='formacoes'>Psicologia</p>
              </div>
              <div className='div_bolinha_formacao_esquerda'>
                <img className='imagem_bolinha' src="bolinha_azul_forte.svg" alt="" />
                <p className='formacoes'>Mestrado em psicologia</p>
              </div>
              <div className='div_button_abrir_curriculo'>
                <button className='button_abrir_curriculo'>+ Abrir curriculo</button>
              </div>
            </div>
            <div className='container-direito_retangulo_dois'>
              <p className='titulo_abordagem'>Abordagens</p>
              <div className='container_bolinha_formacao_direita'>
                <div className='div_bolinha_formacao_direita'>
                  <img className='imagem_bolinha_direita' src="bolinha.svg" alt="" />
                  <p className='abordagens'>Idosos</p>
                </div>
              </div>
              <div className='container_bolinha_formacao_direita'>
                <div className='div_bolinha_formacao_direita'>
                  <img className='imagem_bolinha_direita' src="bolinha.svg" alt="" />
                  <p className='abordagens'>Crianças</p>
                </div>
              </div>
              <div className='container_bolinha_formacao_direita'>
                <div className='div_bolinha_formacao_direita'>
                  <img className='imagem_bolinha_direita' src="bolinha.svg" alt="" />
                  <p className='abordagens'>Casais</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container_tela_agendamento_direita'>
        <div className='div_agendar'>
          <h1 className='titulo_agendar'>Agendar consulta</h1>
        </div>
        <div className="container_buttons_semana">
          <div className="div_button_arrow_esquerdo">
            <button className="button_arrow_esquerdo" onClick={() => alterarSemana(-1)}><img src="arrow_esquerdo.svg" alt="" /></button>
          </div>
          <div className="container-semana">
            {dias.map((dia, index) => (
              <div className="div_dia_data" key={index}>
                <div className="dia_semana">{dia.dia}</div>
                <div className="data_dia">{dia.data}</div>
                <div className="horarios">
                  {horariosAgendamento[dia.dia].slice(0, horariosVisiveis[dia.dia]).map((horario, idx) => (
                    <button key={idx} className="button_horario">{horario}</button>
                  ))}
                </div>
                <div className="buttons-mais-menos">
                  {horariosVisiveis[dia.dia] < horariosAgendamento[dia.dia].length && (
                    <button className="button_mais" onClick={() => mostrarMaisHorarios(dia.dia)}>Mais</button>
                  )}
                  {horariosVisiveis[dia.dia] > 5 && (
                    <button className="button_menos" onClick={() => mostrarMenosHorarios(dia.dia)}>Voltar</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="div_button_arrow_direito">
            <button className="button_arrow_direito" onClick={() => alterarSemana(1)}><img src="arrow_direito.svg" alt="" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelaAgendamento;
