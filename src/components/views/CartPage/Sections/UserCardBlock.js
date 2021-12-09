import React from 'react'

function UserCardBlock(props) {



    const renderCartImage = (images) => {
        if(images.length > 0) {
            let image = images[0]
            return `${image}`
        }
    }

    const renderItems = () => (
        props.products && props.products.map(product => (
            <tr key={product.id}>
                <td>
                    <img style={{ width: '70px' }} alt="product" 
                    src={renderCartImage(product.images)} />
                </td> 
                <td><a href={`/product/${product.plan_id}`} > {product.title} </a></td>
                <td>{product.date}</td>
                <td>{product.continent}</td>
                <td>{product.writer}</td>
                
                <td><button 
                onClick={()=> props.removeItem(product.id)}
                >Remove </button> </td>
            </tr>
        ))
    )


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Plan Image</th>
                        <th>Plan Title</th>
                        <th>Plan Date</th>
                        <th>Plan Continent</th>
                        <th>Plan Writer</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {renderItems()}
                </tbody>
            </table>
        </div>
    )
}

export default UserCardBlock
