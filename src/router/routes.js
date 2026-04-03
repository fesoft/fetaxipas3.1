const passageiroForm = () => import('pages/Financeiro/passageiro-form.vue')
import { passageiro } from 'src/models/Financeiro/passageiro'
const viagensGrid = () => import('pages/Financeiro/viagens-grid.vue')
import { viagens } from 'src/models/Financeiro/viagens'


const routes = [
  {
    path: '/',
    redirect: '/dashboard/index',
    meta: {auth: true}
  },
  {
    path: '/auth',
    component:  () => import('layouts/AuthLayout.vue'),
    children: [
      {
        name: 'loginUser',
        path: '/auth/loginUser',
        component:  () => import('pages/Auth/login-user.vue'),
        meta: {auth: false},
      },
      {
        name: 'login',
        path: '/auth/login',
        component: () => import('pages/Auth/login.vue'),
        meta: {auth: false}
      },
      {
        path: '/auth/recoverStep1',
        component: () => import('pages/Auth/recover-step1.vue'),
        meta: {auth: false}
      },
      {
        path: '/auth/recoverStep2',
        component: () => import('pages/Auth/recover-step2.vue'),
        meta: {auth: false}
      },
      {
        path: '/auth/recoverStep3',
        component: () => import('pages/Auth/recover-step3.vue'),
        meta: {auth: false}
      },
      {
        path: '/auth/alterasenha',
        component: () => import('pages/Auth/alterar-senha.vue'),
        meta: { auth: true, title: 'Alterar senha'}
      },
      {
        path: '/auth/FQ5tN1qDJJdR9yJusO9bUFph3d1Jvsl9CGqtsNDP32pSunHFPoALGaVXlTPjElwX/:id/:id2/:id3',
        component: () => import('pages/Auth/primeiroacesso-form.vue'),
        props: {method: 'new', ...passageiro.formPrimeiroAcesso},
        meta: { auth: false, title: 'Primeiro acesso'}
    },
    ]
  },
  {
    path: '/dashboard',
    component: () => import('layouts/AppLayout.vue'),
    children: [
      {
        name: 'home',
        path: '/dashboard/index',
        component: () => import('pages/Home/index.vue'),
        meta: {auth: true, title: '', coop: true},
      },
      {
        name: 'logoff',
        path: '/dashboard/logoff',
        component: () => import('pages/Auth/login.vue'),
        meta: {auth: true}
      },
      {
        name: 'alterasenha',
        path: '/dashboard/alterasenha',
        component: () => import('pages/Auth/alterar-senha.vue'),
        meta: {auth: true, title: 'Alterar senha'}
      },
      {
        name: 'meusdados',
        path: '/dashboard/meusdados',
        component: passageiroForm,
        props: {method: 'edit', ...passageiro.form},
        meta: { auth: true, title: 'Meus dados', coop: false}
      },
      {
        path: '/dashboard/viagens',
        component: viagensGrid,
        props: viagens,
        meta: { auth: true, title: 'Minhas viagens'}
      },
      {
        name: 'passageiro.new',
        path: '/dashboard/passageiro/new',
        component: passageiroForm,
        props: {method: 'new', ...passageiro.form},
        meta: { auth: true, title: 'Passageiro - Novo', coop: false}
      },
      {
        name: 'passageiro.edit',
        path: '/dashboard/passageiro/:id/edit',
        component: passageiroForm,
        props: {method: 'edit', ...passageiro.form},
        meta: { auth: true, title: 'Passageiro - Editar', coop: false}
      },
      {
        name: 'passageiro.view',
        path: '/dashboard/passageiro/:id/view',
        component: passageiroForm,
        props: {method: 'view', ...passageiro.form},
        meta: { auth: true, title: 'Passageiro - Ver', coop: false}
      },
    ]
  },

]

export default routes
