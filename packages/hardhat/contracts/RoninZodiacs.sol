// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Pausable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

//TODO: agregar el limite de nft en el apartado de compra
//TODO: agregar todo completo al transferfir (ultima function del smart)
//TODO: crear un apartado para las graficas y botones importantes como el revelar NFT, cambiar limite de NFT etc
//TODO: crear otro contract para el apartado del dinero
//TODO: agregar full skeleton a las cards de los NFT
contract RoninZodiacs is ERC721, ERC721Pausable, Ownable {
    struct NFT {
        uint256 tokenId;
        string tokenURI;
    }

    //states
    uint256 private _limitToken = 1; //poner esto en constructor
    uint256 private _uriId;
    string private _undisclosedUri = "ipfs://QmXzT3LSSnAuTtF46nWAr8mtBJguaxwK3DWb54RY9EXdmj";
    mapping(uint256 => string) private _tokenUriMap;
    mapping(address => uint256[]) private _ownedTokens;

    //public states
    uint256 public nextTokenId;
    bool public reveal;

    constructor(address initialOwner) ERC721("RoninZodiacs", "RZK") Ownable(initialOwner) {}

    function safeMint(address to) public {
        require(nextTokenId <= _limitToken, "los tokens se acabaron");
        _safeMint(to, nextTokenId);
        _ownedTokens[to].push(nextTokenId);
        nextTokenId++;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function addTokenCid(string memory _cid) public onlyOwner {
        require(bytes(_cid).length > 0, "URI is not empty");
        _tokenUriMap[_uriId] = string(abi.encodePacked("ipfs://", _cid));
        _uriId++;
    }

    function disclose() public onlyOwner {
        require(!reveal, "NFTs have already been disclosed");
        reveal = true;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return (reveal) ? _tokenUriMap[tokenId] : _undisclosedUri;
    }

    function getUserNFTs(address _owner) public view returns (NFT[] memory) {
        uint256 balance = _ownedTokens[_owner].length;
        NFT[] memory nfts = new NFT[](balance);

        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = _ownedTokens[_owner][i];
            nfts[i] = NFT(tokenId, tokenURI(tokenId));
        }

        return nfts;
    }

    // function transferNFT(address from, address to, uint256 tokenId) public { _transfer(from, to, tokenId); // Transferencia estándar ERC-721 // Eliminar el NFT de la dirección anterior uint256[] storage fromTokens = _ownedTokens[from]; for (uint256 i = 0; i < fromTokens.length; i++) { if (fromTokens[i] == tokenId) { fromTokens[i] = fromTokens[fromTokens.length - 1]; // Mover el último elemento fromTokens.pop(); // Remover el último break; } } // Agregar el NFT a la nueva dirección _ownedTokens[to].push(tokenId); }
    // The following functions are overrides required by Solidity.
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Pausable) returns (address) {
        return super._update(to, tokenId, auth);
    }
}
