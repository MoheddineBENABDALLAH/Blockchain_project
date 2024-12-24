// ProductTraceability.sol
pragma solidity ^0.8.19;

contract ProductTraceability {
    struct ProductInfo {
        uint id;              // ID unique du produit
        string name;          // Nom du produit
        string description;   // Description du produit
        string category;      // Catégorie du produit
        string image;         // URL ou hash de l'image du produit
        uint timestamp;       // Date de création (timestamp)
    }

    // Compteur pour les ID des produits
    uint public productCount = 0;
    
    // Mapping pour stocker les produits par ID
    mapping(uint => ProductInfo) public products;

    // Événement déclenché lorsqu'un produit est ajouté
    event ProductAdded(
        uint id,
        string name,
        string description,
        string category,
        string image,
        uint timestamp
    );

    // Fonction pour ajouter un produit
    function addProduct(
        string memory _name,
        string memory _description,
        string memory _category,
        string memory _image
    ) public {
        // Incrémentation du compteur pour générer un nouvel ID
        productCount++;
        
        // Stockage du produit avec l'ID incrémenté
        products[productCount] = ProductInfo(
            productCount,
            _name,
            _description,
            _category,
            _image,
            block.timestamp
        );
        
        // Émission de l'événement
        emit ProductAdded(
            productCount,
            _name,
            _description,
            _category,
            _image,
            block.timestamp
        );
    }

    // Fonction pour récupérer un produit par ID
    function getProduct(uint _id) public view returns (
        uint,
        string memory,
        string memory,
        string memory,
        string memory,
        uint
    ) {
        // Vérification que l'ID existe
        require(_id > 0 && _id <= productCount, "Product does not exist");
        
        // Récupération du produit
        ProductInfo memory product = products[_id];
        
        return (
            product.id,
            product.name,
            product.description,
            product.category,
            product.image,
            product.timestamp
        );
    }
}
