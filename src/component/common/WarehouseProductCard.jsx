const WarehouseProductCard = ({ idx, product, checked, onToggle }) => {
    // ✅ Pack size from netWeight
    const packSize = product?.netWeight
        ? `${product.netWeight.value}${product.netWeight.unit}`
        : "-";

    // ✅ Expiry date formatting
    const expiryDate = product?.expireDate
        ? new Date(product.expireDate).toLocaleDateString()
        : "-";

    const tradePrice = product.tradePrice || 0;
    const totalPrice = tradePrice * product.totalQuantity;

    return (
        <tr>
            <td className="text-center">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onToggle} // ✅ correct
                />
            </td>

            <td className="text-center">{idx}</td>

            <td>{product.productName}</td>

            {/* ✅ Pack Size */}
            <td>{packSize}</td>

            <td className="text-center">{product.batch}</td>

            {/* ✅ Exp Date */}
            <td className="text-center">{expiryDate}</td>

            <td className="text-center">{product.totalQuantity}</td>

            <td className="text-right">{tradePrice.toFixed(2)}</td>

            <td className="text-right">{totalPrice.toFixed(2)}</td>

            <td className="text-center">—</td>
        </tr>
    );
};

export default WarehouseProductCard;
