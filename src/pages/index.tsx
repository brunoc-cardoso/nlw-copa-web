/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-alert */
import { FormEvent, useState } from 'react';

import { GetServerSideProps, GetStaticProps } from 'next';
import Image from 'next/image';

import appLogoImg from '@/assets/app-logo.svg';
import appPreviewImg from '@/assets/app-nlw-copa-preview.png';
import iconCheckImg from '@/assets/icon-check.svg';
import usersAvatarExampleImg from '@/assets/users-avatar-example.png';

import { api } from 'services/api';

type HomeProps = {
  poolsCount: number;
  guessCount: number;
  userCount: number;
};

export default function Home({ poolsCount, guessCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('');

  async function handleCreatePool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post('pools', {
        title: poolTitle,
      });

      const { code } = response.data;
      await navigator.clipboard.writeText(code);

      alert(
        'Bolão criado com sucesso, o código foi copiado para a área de transferência',
      );
      setPoolTitle('');
    } catch (error) {
      console.error(error);
      alert('Falha ao criar bolão, tente novamente');
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={appLogoImg} alt="Logo nlw copa" quality={100} />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="" quality={100} />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{userCount}</span> pessoas já
            estão usando
          </strong>
        </div>

        <form onSubmit={handleCreatePool} className="mt-10 flex gap-2">
          <input
            type="text"
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            required
            placeholder="Qual o nome do seu bolão?"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded font-bold uppercase text-gray-900 text-sm hover:bg-yellow-700 hover:cursor-pointer"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" quality={100} />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{poolsCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600" />
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" quality={100} />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
        quality={100}
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get('/pools/count'),
      api.get('/guesses/count'),
      api.get('/users/count'),
    ]);

  return {
    props: {
      poolsCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
