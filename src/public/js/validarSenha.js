// Aguarda o carregamento completo do DOM para garantir que todos os elementos HTML estejam disponíveis.

//validar senha criar !
document.addEventListener('DOMContentLoaded', function() {
  // Seleciona os elementos do formulário necessários para a validação.
  const form = document.querySelector('form');
  const senhaInput = document.getElementById('senha');
  const senhaRepetirInput = document.getElementById('senhaRepetir');
  const errorContainer = document.getElementById('error-container');

  /**
   * Função que lida com a submissão do formulário.
   * @param {Event} event - O evento de submissão.
   */
  function handleFormSubmit(event) {
    errorContainer.textContent = ''; // Limpa mensagens de erro anteriores.

    // Validação: verifica se as senhas digitadas são diferentes.
    if (senhaInput.value !== senhaRepetirInput.value) {
      event.preventDefault(); // Impede o envio do formulário se as senhas não baterem.
      errorContainer.textContent = 'As senhas não são iguais. Tente novamente.'; // Exibe uma mensagem de erro.
    }
  }

  /**
   * Função que limpa a mensagem de erro quando o usuário começa a digitar.
   */
  function clearErrorOnChange() {
    errorContainer.textContent = '';
  }

  form.addEventListener('submit', handleFormSubmit);
  senhaInput.addEventListener('input', clearErrorOnChange);
  senhaRepetirInput.addEventListener('input', clearErrorOnChange);
});

//validar senha entrar
