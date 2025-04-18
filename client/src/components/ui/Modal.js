export default function Modal({ isOpen, onClose, title, children, hideOKBUtton }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {/* Modal Content */}
                <div className="text-gray-700">{children}</div>

                {/* Close Button */}
                {/* {!hideOKBUtton && (
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl hover:bg-blue-600"
                        >
                            OK
                        </button>
                    </div>
                )} */}
            </div>
        </div>
    );
}
