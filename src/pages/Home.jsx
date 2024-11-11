import { db } from '../firebase/firebase'
import { collection, doc, getDoc, setDoc, getDocs } from 'firebase/firestore'
import { useState, useEffect } from 'react'
function Home() {
    const [items, setItems] = useState([])

    const getItem = async () => {
        const collectionRef = collection(db, 'items')
        const querySnapshot = await getDocs(collectionRef)

        const itemsList = []

        querySnapshot.forEach((doc) => {
            itemsList.push({
                id: doc.id,
                ...doc.data(),
            })
        })

        setItems(itemsList)
    }

    useEffect(() => {
        getItem()
    }, [])

    return (
        <div className="min-h-screen bg-gray-100">
            {items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-bold">{item.title}</h2>
                    <p className="mt-2">{item.content}</p>
                </div>
            ))}
        </div>
    )
}

export default Home
