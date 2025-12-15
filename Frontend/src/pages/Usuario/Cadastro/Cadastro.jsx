import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ToastGeral from '../../../components/Toast/ToastGeral';
import CadLogForm from '../../../components/Usuario/CadLogForm';

const Cadastro = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const validarSenha = (senha) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(senha);

    const handleCadastro = async (e) => {
        e.preventDefault();
        if (!validarSenha(senha)) {
            toast.error('A senha deve conter no mínimo 8 caracteres, 1 letra maiúscula e 1 número.');
            return;
        }

        try {
            await axios.post('http://localhost:8080/usuario', { nome, email, senha });
            toast.success('Cadastro realizado com sucesso!');
            setTimeout(() => navigate('/login'), 2000);
        } catch {
            toast.error('Erro ao cadastrar usuário. Verifique os dados e tente novamente.');
        }
    };

    return (
        <div>

            <CadLogForm
                titulo="Cadastro"
                onSubmit={handleCadastro}
                campos={[
                    { label: 'Nome:', type: 'text', value: nome, onChange: (e) => setNome(e.target.value), placeholder: 'Digite seu nome' },
                    { label: 'Email:', type: 'email', value: email, onChange: (e) => setEmail(e.target.value), placeholder: 'Digite seu email' },
                    { label: 'Senha:', type: 'password', value: senha, onChange: (e) => setSenha(e.target.value), placeholder: 'Digite sua senha' }
                ]}
                botaoTexto="Cadastrar"
                linkMensagem="Já é cadastrado?"
                linkTexto="Logar"
                linkTo="/login"
                containerClass="container-cadastro-login"
                formGroupClass="form-cadastro-login"
                buttonClass="btn-cadastro-login"
            />

            <ToastGeral />

        </div>
    );
};

export default Cadastro;
