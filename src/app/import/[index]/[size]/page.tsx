import React from 'react'
import DataImportCompon from '@/compon/dataImporting/massImport';

const ImportData = async ({ params }: { params: { index: string, size: string } }) => {
    return (
        < DataImportCompon index={parseInt(params.index)} size={parseInt(params.size)} />
    )
}

export default ImportData;