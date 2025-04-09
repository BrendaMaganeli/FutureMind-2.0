import { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext();

export const GlobalContextProvider = ({children}) => {

const [profissional, setProfissional] =  useState({

    nome_completo: '',
    cpf:'',
    telefone:'',
    preferencias: [],
    data_nascimento: '',
    especializacao: [],
    senha: '',
    foto: 'iconuser.svg',
    abordagem: '',
    email: '',
    crp:'',
    preco: 0.00
});

const [paciente, setPaciente] = useState({

    nome_completo: '',
    cpf:'',
    telefone:'',
    data_nascimento: '',
    senha: '',
    foto: '',
    email: ''
});

    const [user, setUser] = useState(() => {
    
        return JSON.parse(localStorage.getItem('User-Profile')) || null;
    });
    
    useEffect(() => {

        if (user) {

            localStorage.setItem('User-Profile', JSON.stringify(user));
        } else {

            localStorage.removeItem('User-Profile');
        }
    }, [user]);

    const [id, setId] = useState(() => {
    // Recupera o valor de ID do localStorage, se existir
        return localStorage.getItem('id') || null;
    });

    useEffect(() => {
    // Sempre que o ID mudar, atualize o localStorage
    if (id) {
      localStorage.setItem('id', id);
    } else {
      localStorage.removeItem('id');
    }
    }, [id]);
    
    const [usernameValid, setUsernameValid] = useState(false)
    const [usernameHover, setUsernameHover] = useState(false)
    const [data_nascimentoValid, setData_nascimentoValid] = useState(false)
    const [data_nascimentoHover, setData_nascimentoHover] = useState(false)
    const [cpfValid, setCpfValid] = useState(false)
    const [cpfHover, setCpfHover] = useState(false)
    const [telefoneValid, setTelefoneValid] = useState(false)
    const [telefoneHover, setTelefoneHover] = useState(false)
    const [emailValid, setEmailValid] = useState(false)
    const [emailHover, setEmailHover]= useState(false)
    const [senhaValid, setSenhaValid] = useState(false)
    const [senhaHover, setSenhaHover]= useState(false)
    const [crpValid, setCrpValid] = useState(false)
    const [crpHouver, setCrpHover] = useState(false)
    const [atendeValid, setAtendeValid] = useState(false)
    const [especializacaoValid, setEspecializaçãoValid] = useState(false)
    const [valorValid, setValorValid] = useState(false)
    const [valorHover, setValorHover] = useState(false)
    const [data_nascimentoProfissionalValid, setData_nascimentoProfissionalValid] = useState(false)
    const [data_nascimentoProfissionalValidHover, setData_nascimentoProfissionalHover] = useState(false)
    const [nome_profissinalValid, setNomeProfissionalValid] = useState(false)
    const [nome_profissinalHover, setNomeProfissionalHover] = useState(false)
    const [ cpfProfissionalValid, setCpfProfissionalValid ] = useState(false)
    const [ cpfProfissionalHover, setCpfProfissionalHover ] = useState(false)
    const [ telefoneProfissionalValid, setTelefoneProfissionalValid ] = useState(false)
    const [ telefoneProfissinalHover, setTelefoneProfissionalHover ] = useState(false)
    const [emailProfissionalValid, setEmailProfissionalValid] = useState(false)
    const [emailProfissionalHover, setEmailProfissonalHover] = useState(false)
    const [senhaProfissionalValid, setSenhaProfissionalValid] = useState(false)
    const [senhaProfissionalHover, setSenhaProfissionalHover] = useState(false)
    const [erros_passar, setErros_passar] = useState("")
    const [checkbox_cheked, setcheckbox_cheked] = useState(false)

    return(
        <GlobalContext.Provider value={{
        
        profissional, setProfissional, paciente, setPaciente, 
        user, setUser, 
        id, setId, 
        usernameValid, setUsernameValid, usernameHover, setUsernameHover,
        data_nascimentoValid, setData_nascimentoValid, data_nascimentoHover,setData_nascimentoHover,
        cpfValid, setCpfValid, cpfHover, setCpfHover,
        telefoneValid, setTelefoneValid, telefoneHover, setTelefoneHover,
        emailValid, setEmailValid, emailHover, setEmailHover, 
        senhaValid, setSenhaValid, senhaHover, setSenhaHover,
        crpValid, setCrpValid, crpHouver, setCrpHover,
        atendeValid, setAtendeValid,
        especializacaoValid, setEspecializaçãoValid,
        valorValid, setValorValid, valorHover, setValorHover,
        data_nascimentoProfissionalValid, setData_nascimentoProfissionalValid,data_nascimentoProfissionalValidHover, setData_nascimentoProfissionalHover,
        nome_profissinalValid, setNomeProfissionalValid, nome_profissinalHover, setNomeProfissionalHover,
        cpfProfissionalValid, setCpfProfissionalValid,cpfProfissionalHover, setCpfProfissionalHover,
        telefoneProfissionalValid, setTelefoneProfissionalValid, telefoneProfissinalHover, setTelefoneProfissionalHover,
        emailProfissionalValid, setEmailProfissionalValid, emailProfissionalHover, setEmailProfissonalHover,
        senhaProfissionalValid, setSenhaProfissionalValid, senhaProfissionalHover, setSenhaProfissionalHover,
        erros_passar, setErros_passar, checkbox_cheked, setcheckbox_cheked

        }}>
            {children}
        </GlobalContext.Provider>
    );
};