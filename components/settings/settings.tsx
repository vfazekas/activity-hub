import { ChevronDown } from 'lucide-react';
import { PageHeader } from '../shared/page-header';
import { Avatar } from '../shared/avatar';

export function Settings() {
  return (
    <>
      <PageHeader
        title='Configurações'
        description='Personalize sua experiência no Gerenciador de Atividades.'
      />

      <div className='grid max-w-3xl gap-5'>
        <div className='rounded-xl border bg-card p-6'>
          <h2 className='font-semibold'>Perfil</h2>

          <p className='mt-1 text-sm text-muted-foreground'>
            Informações pessoais e de acesso
          </p>

          <div className='mt-5 flex items-center gap-4'>
            <Avatar initials='VF' className='size-14 text-base' />

            <div>
              <p className='font-medium'>Victor Fazekas</p>

              <p className='text-sm text-muted-foreground'>
                victor.fazekas@empresa.com
              </p>
            </div>

            <button className='ml-auto rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted'>
              Editar perfil
            </button>
          </div>
        </div>

        <div className='rounded-xl border bg-card p-6'>
          <h2 className='font-semibold'>Preferências</h2>

          <p className='mt-1 text-sm text-muted-foreground'>
            Ajuste a aparência do sistema
          </p>

          <div className='mt-5 flex items-center justify-between border-t pt-4'>
            <div>
              <p className='text-sm font-medium'>Tema</p>

              <p className='text-xs text-muted-foreground'>
                Escolha como o sistema deve aparecer
              </p>
            </div>

            <button className='flex items-center gap-2 rounded-lg border px-3 py-2 text-xs'>
              Sistema
              <ChevronDown className='size-3.5' />
            </button>
          </div>
        </div>

        <div className='rounded-xl border bg-card p-6'>
          <h2 className='font-semibold'>Notificações</h2>

          {[
            'Atividades atrasadas',
            'Atividades vencendo hoje',
            'Atualizações dos projetos',
          ].map((item) => (
            <label
              key={item}
              className='mt-4 flex items-center gap-3 text-sm'
            >
              <input type='checkbox' defaultChecked />
              {item}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}