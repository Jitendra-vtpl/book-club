import Header from '../components/Header'
const Public = (props: any) => {  
  return (
    <>
      <Header />
      {props.children}
    </>
  )

}

export default Public