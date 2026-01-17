import React from "react";

const WarehouseProductCard = ({ idx, product }) => {
    return (
        <tr>
            <td className="text-center">{idx}</td>
            <td>{product.productName}</td>
            <td>{product.packSize}</td>
            <td className="text-center">{product.batch}</td>
            <td className="text-center">{product.expiryDate}</td>
            <td className="text-center">{product.totalQuantity}</td>
            <td className="text-right">{product.tradePrice}</td>
            <td className="text-right">{(product.tradePrice * product.totalQuantity).toFixed(2)}</td>
            <td className="text-center">
                {/* Action buttons if needed */}
            </td>
        </tr>
    );
};

export default WarehouseProductCard;
