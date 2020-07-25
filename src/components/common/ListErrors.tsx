import React from 'react';
import { Errors } from '@Types';

export default function ListErrors({ errors }: { errors: Errors | string }) {
    //错误类型类型为字符串直接显示错误信息
    if (errors.substr) {
        return (
            <ul className="error-messages">
                <li>{errors}</li>
            </ul>
        );
    }

    //错误类型为数组，遍历显示多条错误信息
    return (
        <ul className="error-messages">
            {Object.entries(errors).map(([key, keyErrors], index) =>
                keyErrors.map((error: any) => (
                    <li key={index}>
                        {key} {error}
                    </li>
                ))
            )}
        </ul>
    );
}
