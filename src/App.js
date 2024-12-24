import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import ProductTraceability from './ProductTraceability.json';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8; // Afficher 8 produits par page

    useEffect(() => {
        loadBlockchainData();
    }, []);

    const loadBlockchainData = async () => {
        try {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);

                const networkData = ProductTraceability.networks["5777"];

                if (networkData) {
                    const abi = ProductTraceability.abi;
                    const address = networkData.address;
                    const contractInstance = new web3.eth.Contract(abi, address);
                    setContract(contractInstance);

                    loadProducts(contractInstance);
                } else {
                    setError('Contrat non déployé sur le réseau actuel.');
                }
            } else {
                setError('Veuillez installer MetaMask.');
            }
        } catch (err) {
            setError('Erreur lors du chargement de la blockchain.');
            console.error(err);
        } finally {
            setTimeout(() => setError(''), 4000);
        }
    };

    const addProduct = async () => {
        if (!name || !description || !category || !image) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        try {
            setLoading(true);
            await contract.methods.addProduct(name, description, category, image).send({ from: account, gas: '1000000' });
            setName('');
            setDescription('');
            setCategory('');
            setImage('');
            setSuccess(`Produit ajouté avec succès ! Nom: ${name}, Catégorie: ${category}`);
            await loadProducts(contract);
        } catch (err) {
            setError('Erreur lors de l\'ajout du produit.');
            console.error(err);
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(''), 4000);
            setTimeout(() => setError(''), 4000);
        }
    };

    const loadProducts = async (contractInstance) => {
        try {
            const productCount = await contractInstance.methods.productCount().call();
            const productsArray = [];
            for (let i = 1; i <= productCount; i++) {
                const product = await contractInstance.methods.getProduct(i).call();
                productsArray.push(product);
            }
            setProducts(productsArray);
        } catch (err) {
            setError('Erreur lors du chargement des produits.');
            console.error(err);
        } finally {
            setTimeout(() => setError(''), 4000);
        }
    };

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            <nav className="navbar navbar-dark bg-dark mb-4">
                <div className="container">
                    <span className="navbar-brand mb-0 h1 mx-auto text-center" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        Application de traçabilité des produits
                    </span>
                </div>
            </nav>

            <div className="container mt-4">
                {success && <div className="alert alert-success">{success}</div>}
                {error && !success && <div className="alert alert-danger">{error}</div>}

                <p>
                    <span style={{ textDecoration: 'underline', color: 'red' }}>Compte:</span> {account}
                </p>

                <button
                    className="btn btn-primary mb-3"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Masquer le formulaire' : 'Ajouter un produit'}
                </button>

                {showForm && (
                    <div className="card p-3 mb-4 shadow-sm">
                        <h5 className="card-title">Ajouter un produit</h5>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Nom du produit"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <textarea
                                className="form-control mb-2"
                                placeholder="Description du produit"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <select
                                className="form-control mb-2"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Choisissez une catégorie</option>
                                <option value="Machines">Machines</option>
                                <option value="Pièces détachées">Pièces détachées</option>
                                <option value="Consommables">Consommables</option>
                                <option value="Autre">Autre</option>
                            </select>
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="URL de l'image du produit"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            />
                            <button className="btn btn-success" onClick={addProduct} disabled={loading}>
                                {loading ? 'Ajout en cours...' : 'Ajouter le produit'}
                            </button>
                        </div>
                    </div>
                )}

                <div className="p-3" style={{ backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
                    <div className="row">
                        <span className="navbar-brand mb-0 h1 mx-auto text-center" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '100px' }}>
                            Produits
                        </span>

                        {currentProducts.map((product, index) => (
                            <div className="col-md-3 mb-4" key={index} style={{ paddingTop: '50px' }}>
                                <div className="card h-100 shadow-sm" style={{ border: '1px solid #ccc', maxWidth: '100%' }}>
                                    <div className="card-body">
                                        <h5 className="card-title text-center" style={{ fontWeight: 'bold' }}>{product[1]}</h5>
                                        <img
                                            src={product[4]}
                                            alt="Produit"
                                            className="img-fluid mb-3"
                                            style={{ maxHeight: '150px', objectFit: 'contain', borderRadius: '5px' }}
                                        />
                                        <p><strong>Catégorie:</strong> {product[3]}</p>
                                        <p><strong>Date:</strong> {new Date(Number(product[5]) * 1000).toLocaleString()}</p>
                                        <p><strong>Numéro:</strong> {Number(product[0]).toString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination buttons */}
                    <div className="d-flex justify-content-center">
                        <ul className="pagination">
                            {pageNumbers.map(number => (
                                <li key={number} className="page-item">
                                    <button onClick={() => paginate(number)} className="page-link">
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
