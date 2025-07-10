// App.tsx
import { useState, useEffect } from 'react';
import Inicio from './components/Inicio';
import Precos from './components/Precos';
import SliderComLock from './components/SliderPorcentagens';
import Resultado from './components/Resultado';


type TipoCarne = 'bovina' | 'frango' | 'suina' | 'linguica';

interface CarneEstado {
  porcentagem: number;
  locked: boolean;
}



const PORCENTAGENS_PADRAO: Record<TipoCarne, number> = {
  bovina: 50,
  frango: 20,
  suina: 10,
  linguica: 20,
};

function criaEstadoZerado(): Record<TipoCarne, CarneEstado> {
  return {
    bovina: { porcentagem: 0, locked: false },
    frango: { porcentagem: 0, locked: false },
    suina: { porcentagem: 0, locked: false },
    linguica: { porcentagem: 0, locked: false },
  };
}

function App() {
  const [etapa, setEtapa] = useState(1);
  const [pessoas, setPessoas] = useState<string>(''); // começa vazio
  const [nivelApetite, setNivelApetite] = useState<'leve' | 'medio' | 'pesado'>('medio');
  const [carnesSelecionadas, setCarnesSelecionadas] = useState<TipoCarne[]>([]);
  const [estadoPorcentagens, setEstadoPorcentagens] = useState<Record<TipoCarne, CarneEstado>>(criaEstadoZerado());
  const [precos, setPrecos] = useState<Record<TipoCarne, number | undefined>>({
    bovina: undefined,
    frango: undefined,
    suina: undefined,
    linguica: undefined,
  });

  const pessoasNumber = pessoas === '' ? 0 : Number(pessoas);



  useEffect(() => {
    if (carnesSelecionadas.length > 0) {
      const novasPorcentagens = criaEstadoZerado();

      carnesSelecionadas.forEach((tipo) => {
        novasPorcentagens[tipo] = { porcentagem: PORCENTAGENS_PADRAO[tipo] ?? 0, locked: false };
      });

      const soma = Object.values(novasPorcentagens).reduce((acc, val) => acc + val.porcentagem, 0);
      Object.keys(novasPorcentagens).forEach((key) => {
        novasPorcentagens[key as TipoCarne].porcentagem =
          soma === 0 ? 0 : (novasPorcentagens[key as TipoCarne].porcentagem * 100) / soma;
      });

      setEstadoPorcentagens(novasPorcentagens);
    } else {
      setEstadoPorcentagens(criaEstadoZerado());
    }
  }, [carnesSelecionadas]);

  const avancar = () => setEtapa((prev) => prev + 1);
  const voltar = () => setEtapa((prev) => prev - 1);

return (
    <div className="app" style={{ maxWidth: 480, margin: 'auto', padding: 20 }}>
      {etapa === 1 && (
        <Inicio
          pessoas={pessoas}
          setPessoas={setPessoas}
          carnesSelecionadas={carnesSelecionadas}
          setCarnesSelecionadas={setCarnesSelecionadas}
          avancar={avancar}
          nivelApetite={nivelApetite}
          setNivelApetite={setNivelApetite}
        />
      )}

      {etapa === 2 && (
        <Precos
          carnesSelecionadas={carnesSelecionadas}
          precos={precos}
          setPrecos={setPrecos}
          avancar={avancar}
          voltar={voltar}
        />
      )}

      {etapa === 3 && (
        <SliderComLock
          carnesSelecionadas={carnesSelecionadas}
          estadoPorcentagens={estadoPorcentagens}
          setEstadoPorcentagens={setEstadoPorcentagens}
          pessoas={pessoasNumber}
          precos={precos as Record<TipoCarne, number>}
          nivelApetite={nivelApetite}
          avancar={avancar}
          voltar={voltar}
        />
      )}

      {etapa === 4 && (
        <Resultado
          pessoas={pessoasNumber}
          carnesSelecionadas={carnesSelecionadas}
          porcentagens={Object.fromEntries(
            Object.entries(estadoPorcentagens).map(([k, v]) => [k, v.porcentagem])
          ) as Record<TipoCarne, number>}
          precos={precos as Record<TipoCarne, number>}
          nivelApetite={nivelApetite}
          voltar={voltar}
        />
      )}
    </div>
  );
}

export default App;
