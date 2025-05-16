// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Pausable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract RoninZodiacs is ERC721, ERC721Pausable, Ownable {
    //states
    uint256 private _nextTokenId;
    uint256 private _limitToken = 1; //poner esto en constructor
    uint256 private _uriId;
    bool _reveal;
    string private _undisclosedUri = "ipfs://{CID}";
    mapping(uint256 => string) private _tokenUriMap;

    constructor(address initialOwner) ERC721("RoninZodiacs", "RZK") Ownable(initialOwner) {}

    function safeMint(address to) public {
        require(_nextTokenId <= _limitToken, "los tokens se acabaron");
        _safeMint(to, _nextTokenId);
        _nextTokenId++;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function addTokenUri(string memory _uriCid) public onlyOwner {
        require(bytes(_uriCid).length > 0, "URI is not empty");
        _tokenUriMap[_uriId] = string(abi.encodePacked("ipfs://", _uriCid));
        _uriId++;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return (_reveal) ? _tokenUriMap[tokenId] : _undisclosedUri;
    }

    // The following functions are overrides required by Solidity.
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Pausable) returns (address) {
        return super._update(to, tokenId, auth);
    }
}
