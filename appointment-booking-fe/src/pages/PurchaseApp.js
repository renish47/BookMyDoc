import React from 'react'
import Container from 'react-bootstrap/esm/Container'

function PurchaseApp() {
    return (
        <Container fluid className='text-center'>
            <h3 className='mt-5 ps-5 text-muted' style={{ paddingTop: '35vh' }}>
                Purchase
                <span className='h1 px-3 text-dark'>
                    BookMy
                    <span className='text-primary'>
                        Doc
                    </span>
                </span>
                Now
            </h3>
            <p className=' text-muted'>Purchase code is "1111-2222-3333-4444"</p>
        </Container>
    )
}

export default PurchaseApp