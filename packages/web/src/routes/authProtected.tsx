import Header from '../components/Header'

const AuthProtected = (props: any) => {  
  return (
    <>
      <Header />
      {props.children}
    </>
  )
}

export default AuthProtected