const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

function initializeAutomaton() {
  const states: Array<number> = [];
  const alphabet: Array<string> = ALPHABET.split('');
  const matrix: Array<Record<string, any>> = [{}]

  states.push(0);

  for (const state of states) {
    for (const char of alphabet) {
      matrix[state][char] = -1;
    }
  }

  return { matrix, states };
}

function addToken(matrix: Array<Record<string, any>>, states: number[], token: string) {
  let currentState = 0;

  for (const char of token) {
    if (matrix[currentState][char] === -1 || matrix[currentState][char] === undefined) {
      const newState = states.length;
      states.push(newState);
      matrix.push({})
      matrix[currentState][char] = newState;
    }

    currentState = matrix[currentState][char];
  }

  if (matrix[currentState] == undefined) matrix.push({})
  matrix[currentState]['EOS'] = true;
}

function verifyToken(matrix: Array<Record<string, any>>, token: string) {
  let currentState = 0;

  for (const char of token) {
    // console.log(currentState, char)
    if (matrix[currentState][char] === -1) return false;
    currentState = matrix[currentState][char]
  }

  return matrix[currentState]['EOS'] === true;
}

(function () {
  const { matrix, states } = initializeAutomaton();
  const tokenInput = document.querySelector('#token-input');
  const tokenVerify = document.querySelector('#token-verify');
  const result = document.querySelector('#result');

  tokenInput?.addEventListener('input', function (e: any) {
    const { value } = e.target;

    const newValue = value
      .toLowerCase()
      .replace(/[^\w]/, '')
      .replace(/[0-9]/, '');

    e.target.value = newValue;
  });

  tokenVerify?.addEventListener('input', function (e: any) {
    const { value } = e.target;

    const newValue = value
      .toLowerCase()
      .replace(/[^\w]/, '')
      .replace(/[0-9]/, '');

    e.target.value = newValue;

    if (verifyToken(matrix, newValue)) {
      result!.textContent = `Token ${newValue} reconhecido`
    } else {
      result!.textContent = `Token ${newValue} não reconhecido`
    }
  });

  tokenInput?.addEventListener('keydown', function (e: any) {
    if (e.keyCode == 32 || e.keyCode == 13) {
      const token = e.target.value
      addToken(matrix, states, token);
      e.target.value = '';
    }
  });

})()
