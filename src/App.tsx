import { useEffect } from 'react';
import { Header } from './components/Header';
import { Table } from './components/Table';
import { Ledger } from './components/Ledger';
import { Rules } from './components/Rules';
import { Toast } from './components/Toast';
import { ModalHost } from './components/modals/ModalHost';
import { game } from './store/useGame';

export default function App() {
  useEffect(() => {
    const s = game();
    if (s.players.length !== 4 && !s.modal) s.openModal({ type: 'setup' });
  }, []);

  return (
    <>
      <div className="wrap">
        <Header />
        <Table />
        <Ledger />
        <Rules />
      </div>
      <ModalHost />
      <Toast />
    </>
  );
}
